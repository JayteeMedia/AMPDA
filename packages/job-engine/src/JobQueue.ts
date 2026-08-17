import { Job } from "./Job.js";

export class JobQueue {
  private readonly queue: Job[] = [];

  enqueue(job: Job): void {
    this.queue.push(job);
  }

  dequeue(): Job | undefined {
    return this.queue.shift();
  }

  peek(): Job | undefined {
    return this.queue[0];
  }

  size(): number {
    return this.queue.length;
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  clear(): void {
    this.queue.length = 0;
  }

  jobs(): readonly Job[] {
    return this.queue;
  }
}
