import { eq } from "drizzle-orm";

import { db } from "../../db/client.js";
import { songWrites } from "../../db/schema.js";

import type {
  SongWritingResult,
} from "../agents/SongWritingAgent.js";

export type CreateSongWriteInput = {
  songId: string;
  result: SongWritingResult;
};

export class SongWriteRepository {

  async create(
    input: CreateSongWriteInput,
  ) {
    const now =
      new Date().toISOString();

    const id =
      `write_${Date.now()}_` +
      Math.random()
        .toString(36)
        .slice(2, 8);

    const write = {
      id,

      songId:
        input.songId,

      lyrics:
        input.result.lyrics,

      structure:
        JSON.stringify(
          input.result.structure,
        ),

      vocalDirection:
        input.result.vocalDirection,

      writingNotes:
        input.result.writingNotes,

      createdAt:
        now,

      updatedAt:
        now,
    };

    await db
      .insert(songWrites)
      .values(write);

    return write;
  }

  async findBySongId(
    songId: string,
  ) {
    const result =
      await db
        .select()
        .from(songWrites)
        .where(
          eq(
            songWrites.songId,
            songId,
          ),
        )
        .limit(1);

    const row = result[0];

    if (!row) {
      return null;
    }

    return {
      ...row,

      structure:
        JSON.parse(row.structure),
    };
  }
}
