import type { Job } from "./Job.js";
import type { JobResult } from "./JobResult.js";
import type { JobHandler } from "./JobHandlerRegistry.js";

export class JobExecutor {
  async execute<T>(
    job: Job<T>,
    handler: JobHandler<T>,
  ): Promise<JobResult<T>> {
    job.start();

    const startedAt = new Date();

    try {
      const data = await handler(job);

      const finishedAt = new Date();

      const result: JobResult<T> = {
        success: true,
        data,
        startedAt,
        finishedAt,
        durationMs:
          finishedAt.getTime() - startedAt.getTime(),
      };

      job.complete(result);

      return result;
    } catch (error) {
      const finishedAt = new Date();

      const result: JobResult<T> = {
        success: false,
        error:
          error instanceof Error
            ? error
            : new Error(String(error)),
        startedAt,
        finishedAt,
        durationMs:
          finishedAt.getTime() - startedAt.getTime(),
      };

      job.fail(result);

      return result;
    }
  }
}
