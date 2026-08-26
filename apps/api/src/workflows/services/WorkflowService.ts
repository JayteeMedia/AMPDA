import {
  WorkflowJobRepository,
} from "../repositories/WorkflowJobRepository.js";

import type {
  WorkflowJob,
  WorkflowJobType,
} from "../types.js";

const NEXT_STATUS_JOB_TYPE: Record<
  string,
  WorkflowJobType | undefined
> = {
  queued: "song_planning",
  planning: "song_writing",
  writing: "song_production",
  production: "song_review",
  approved: "song_release",
};

export class WorkflowService {
  constructor(
    private readonly repository: WorkflowJobRepository,
  ) {}

  async enqueueSongPlanning(
    songId: string,
  ): Promise<WorkflowJob> {
    return this.repository.create({
      songId,
      type: "song_planning",
      payload: {
        source: "song_created",
      },
    });
  }

  async enqueueForStatus(
    songId: string,
    status: string,
  ): Promise<WorkflowJob | null> {
    const type =
      NEXT_STATUS_JOB_TYPE[status];

    if (!type) {
      return null;
    }

    return this.repository.create({
      songId,
      type,
      payload: {
        source: "song_status_changed",
        status,
      },
    });
  }

  async enqueue(
    songId: string,
    type: WorkflowJobType,
    payload: Record<string, unknown> = {},
  ): Promise<WorkflowJob> {
    return this.repository.create({
      songId,
      type,
      payload,
    });
  }

  async getJob(
    id: string,
  ): Promise<WorkflowJob | null> {
    return this.repository.findById(id);
  }

  async getPendingJobs(): Promise<WorkflowJob[]> {
    return this.repository.findPending();
  }
}
