import { SongRepository } from "../repositories/SongRepository.js";

import {
  canTransitionSong,
  getAllowedTransitions,
  InvalidSongTransitionError,
  isSongStatus,
} from "./SongStatusService.js";

import {
  WorkflowService,
} from "../workflows/services/WorkflowService.js";

import type { SongStatus } from "../db/schema.js";

export type CreateSongCommand = {
  title?: string;
  genre?: string;
  mood?: string;
  theme?: string;
};

export class SongService {
  constructor(
    private readonly repository: SongRepository,
    private readonly workflowService: WorkflowService,
  ) {}

  async listSongs() {
    return this.repository.findAll();
  }

  async getSong(id: string) {
    return this.repository.findById(id);
  }

  async createSong(
    command: CreateSongCommand,
  ) {
    const title = command.title?.trim();

    if (!title) {
      throw new Error(
        "Song title is required",
      );
    }

    const song =
      await this.repository.create({
        title,
        genre:
          command.genre?.trim() ||
          "Hip Hop",
        mood:
          command.mood?.trim() ||
          "Focused",
        theme:
          command.theme?.trim() ||
          "",
      });

    await this.workflowService.enqueueSongPlanning(
      song.id,
    );

    return song;
  }

  async updateStatus(
    id: string,
    requestedStatus: string,
  ) {
    const song =
      await this.repository.findById(id);

    if (!song) {
      return null;
    }

    if (!isSongStatus(requestedStatus)) {
      throw new Error(
        `Invalid song status: ${requestedStatus}`,
      );
    }

    const from =
      song.status as SongStatus;

    const to =
      requestedStatus as SongStatus;

    if (!canTransitionSong(from, to)) {
      throw new InvalidSongTransitionError(
        from,
        to,
      );
    }

    const updatedSong =
      await this.repository.updateStatus(
        id,
        to,
      );

    await this.workflowService.enqueueForStatus(
      id,
      to,
    );

    return updatedSong;
  }

  getAllowedTransitions(
    status: string,
  ) {
    if (!isSongStatus(status)) {
      return [];
    }

    return getAllowedTransitions(status);
  }
}
