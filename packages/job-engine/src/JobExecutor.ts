import type { Job } from "./Job.js";
import type { JobResult } from "./JobResult.js";
import type { JobHandler } from "./JobHandlerRegistry.js";

import {
  JobEventType,
} from "./JobEvents.js";

import {
  JobEventBus,
} from "./JobEventBus.js";

import {
  JobStatus,
} from "./JobStatus.js";

export interface JobExecutorOptions {
  events?: JobEventBus;
}

export class JobExecutor {
  private readonly events?: JobEventBus;

  constructor(
    options: JobExecutorOptions | JobEventBus = {},
  ) {
    this.events =
      options instanceof JobEventBus
        ? options
        : options.events;
  }

  async execute<
    TPayload,
    TResult,
  >(
    job: Job<TPayload, TResult>,
    handler: JobHandler<TPayload, TResult>,
  ): Promise<JobResult<TResult>> {
    if (job.status === JobStatus.Cancelled) {
      const timestamp = new Date();

      const error = new Error(
        `Job '${job.id}' was cancelled before execution.`,
      );

      const result: JobResult<TResult> = {
        success: false,
        error,
        startedAt: timestamp,
        finishedAt: timestamp,
        durationMs: 0,
      };

      job.error = error;

      await this.events?.publish({
        type: JobEventType.Cancelled,
        job,
        timestamp,
        metadata: {},
        result,
        error,
      });

      return result;
    }

    if (job.status !== JobStatus.Pending) {
      throw new Error(
        `Job '${job.id}' cannot execute from status '${job.status}'.`,
      );
    }

    job.status = JobStatus.Running;

    const startedAt = new Date();

    job.startedAt = startedAt;
    job.error = undefined;

    await this.events?.publish({
      type: JobEventType.Started,
      job,
      timestamp: startedAt,
      metadata: {},
    });

    try {
      const data = await handler(job);

      const finishedAt = new Date();

      job.completedAt = finishedAt;
      job.status = JobStatus.Completed;
      job.result = data;
      job.error = undefined;

      const result: JobResult<TResult> = {
        success: true,
        data,
        startedAt,
        finishedAt,
        durationMs:
          finishedAt.getTime() -
          startedAt.getTime(),
      };

      await this.events?.publish({
        type: JobEventType.Completed,
        job,
        result,
        timestamp: finishedAt,
        metadata: {},
      });

      return result;
    } catch (error) {
      const finishedAt = new Date();

      const normalizedError =
        error instanceof Error
          ? error
          : new Error(String(error));

      job.completedAt = finishedAt;
      job.status = JobStatus.Failed;
      job.error = normalizedError;

      const result: JobResult<TResult> = {
        success: false,
        error: normalizedError,
        startedAt,
        finishedAt,
        durationMs:
          finishedAt.getTime() -
          startedAt.getTime(),
      };

      await this.events?.publish({
        type: JobEventType.Failed,
        job,
        result,
        timestamp: finishedAt,
        metadata: {},
        error: normalizedError,
      });

      return result;
    }
  }
}
