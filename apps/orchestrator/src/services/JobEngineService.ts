import {
  Job,
  JobExecutor,
  JobHandlerRegistry,
  JobQueue,
  type JobHandler,
  type JobResult,
} from "@ampda/job-engine";

export class JobEngineService {
  public readonly queue =
    new JobQueue();

  public readonly executor =
    new JobExecutor();

  public readonly handlers =
    new JobHandlerRegistry();

  register<T>(
    name: string,
    handler: JobHandler<T>,
  ): void {
    this.handlers.register(name, handler);
  }

  submit(job: Job): void {
    this.queue.enqueue(job);
  }

  async executeNext(): Promise<
    JobResult | undefined
  > {
    const job = this.queue.dequeue();

    if (!job) {
      return undefined;
    }

    const handler =
      this.handlers.resolve(job.name);

    return this.executor.execute(
      job,
      handler,
    );
  }

  size(): number {
    return this.queue.size();
  }

  isEmpty(): boolean {
    return this.queue.isEmpty();
  }
}

export const jobEngine =
  new JobEngineService();
