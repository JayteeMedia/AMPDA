import type { JobPriority } from "./JobPriority.js";
import type { JobStatus } from "./JobStatus.js";

export interface Job<
  TPayload = unknown,
  TResult = unknown,
> {
  id: string;

  name: string;

  payload: TPayload;

  priority: JobPriority;

  status: JobStatus;

  metadata: Record<
    string,
    unknown
  >;

  createdAt: Date;

  startedAt?: Date;

  completedAt?: Date;

  result?: TResult;

  error?: Error;
}
