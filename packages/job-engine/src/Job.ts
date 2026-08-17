import type { JobContext } from "./JobContext.js";
import type { JobId } from "./JobId.js";
import type { JobResult } from "./JobResult.js";

import { JobPriority } from "./JobPriority.js";
import { JobStatus } from "./JobStatus.js";

export interface JobOptions {
  id: JobId;
  name: string;
  priority?: JobPriority;
  context?: JobContext;
}

export class Job<T = unknown> {
  public readonly id: JobId;

  public readonly name: string;

  public readonly priority: JobPriority;

  public status: JobStatus;

  public readonly createdAt: Date;

  public readonly context: JobContext;

  public result?: JobResult<T>;

  constructor(options: JobOptions) {
    this.id = options.id;

    this.name = options.name;

    this.priority =
      options.priority ?? JobPriority.Normal;

    this.status = JobStatus.Pending;

    this.createdAt = new Date();

    this.context =
      options.context ?? {
        metadata: {},
      };
  }

  start(): void {
    this.status = JobStatus.Running;
  }

  complete(result: JobResult<T>): void {
    this.result = result;

    this.status = JobStatus.Completed;
  }

  fail(result: JobResult<T>): void {
    this.result = result;

    this.status = JobStatus.Failed;
  }

  cancel(): void {
    this.status = JobStatus.Cancelled;
  }

  isFinished(): boolean {
    return (
      this.status === JobStatus.Completed ||
      this.status === JobStatus.Failed ||
      this.status === JobStatus.Cancelled
    );
  }
}
