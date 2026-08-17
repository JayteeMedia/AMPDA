import type { Job } from "./Job.js";

export class JobQueue {
  private readonly jobs: Job<any, any>[] = [];

  enqueue<
    TPayload,
    TResult,
  >(
    job: Job<TPayload, TResult>,
  ): void {
    this.jobs.push(job);
  }

  dequeue<
    TPayload,
    TResult,
  >(): Job<TPayload, TResult> | undefined {
    return this.jobs.shift() as
      | Job<TPayload, TResult>
      | undefined;
  }

  peek<
    TPayload,
    TResult,
  >(): Job<TPayload, TResult> | undefined {
    return this.jobs[0] as
      | Job<TPayload, TResult>
      | undefined;
  }

  clear(): void {
    this.jobs.length = 0;
  }

  size(): number {
    return this.jobs.length;
  }

  isEmpty(): boolean {
    return this.jobs.length === 0;
  }

  list(): readonly Job<any, any>[] {
    return this.jobs;
  }
}
