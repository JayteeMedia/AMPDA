import type { Job } from "./Job.js";
import type { JobResult } from "./JobResult.js";

export enum JobEventType {
  Queued = "job.queued",
  Started = "job.started",
  Completed = "job.completed",
  Failed = "job.failed",
  Cancelled = "job.cancelled",
}

export interface JobEvent<
  TPayload = unknown,
  TResult = unknown,
> {
  type: JobEventType;

  job: Job<TPayload, TResult>;

  timestamp: Date;

  metadata: Record<string, unknown>;

  result?: JobResult<TResult>;

  error?: Error;
}

export type JobEventHandler<
  TPayload = unknown,
  TResult = unknown,
> = (
  event: JobEvent<TPayload, TResult>,
) => void | Promise<void>;
