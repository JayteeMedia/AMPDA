import type { Job } from "./Job.js";
import type { JobResult } from "./JobResult.js";
import type { JobHandler } from "./JobHandlerRegistry.js";

import { JobStatus } from "./JobStatus.js";

export class JobExecutor {
  async execute<
    TPayload,
    TResult,
  >(
    job: Job<TPayload, TResult>,
    handler: JobHandler<
      TPayload,
      TResult
    >,
  ): Promise<JobResult<TResult>> {

    job.status = JobStatus.Running;

    const startedAt = new Date();

    job.startedAt = startedAt;

    try {

      const data =
        await handler(job);

      const finishedAt = new Date();

      job.completedAt = finishedAt;

      job.status = JobStatus.Completed;

      job.result = data;

      const result: JobResult<TResult> = {
        success: true,
        data,
        startedAt,
        finishedAt,
        durationMs:
          finishedAt.getTime() -
          startedAt.getTime(),
      };

      return result;

    } catch (error) {

      const finishedAt = new Date();

      job.completedAt = finishedAt;

      job.status = JobStatus.Failed;

      job.error =
        error instanceof Error
          ? error
          : new Error(String(error));

      return {
        success: false,
        error: job.error,
        startedAt,
        finishedAt,
        durationMs:
          finishedAt.getTime() -
          startedAt.getTime(),
      };
    }
  }
}
