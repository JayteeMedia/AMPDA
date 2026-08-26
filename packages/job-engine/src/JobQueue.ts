import type { Job } from "./Job.js";
import { JobPriority } from "./JobPriority.js";

const priorityWeight: Record<JobPriority, number> = {
  [JobPriority.Critical]: 4,
  [JobPriority.High]: 3,
  [JobPriority.Normal]: 2,
  [JobPriority.Low]: 1,
};

export class JobQueue {
  private readonly jobs: Job<any, any>[] = [];

  enqueue<TPayload, TResult>(
    job: Job<TPayload, TResult>,
  ): void {
    this.jobs.push(job);

    this.jobs.sort(
      (a, b) =>
        priorityWeight[b.priority] -
        priorityWeight[a.priority],
    );
  }

  dequeue<TPayload, TResult>():
    | Job<TPayload, TResult>
    | undefined {
    return this.jobs.shift() as
      | Job<TPayload, TResult>
      | undefined;
  }

  peek<TPayload, TResult>():
    | Job<TPayload, TResult>
    | undefined {
    return this.jobs[0] as
      | Job<TPayload, TResult>
      | undefined;
  }

  remove(jobId: string): boolean {
    const index = this.jobs.findIndex(
      (job) => job.id === jobId,
    );

    if (index === -1) {
      return false;
    }

    this.jobs.splice(index, 1);
    return true;
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
