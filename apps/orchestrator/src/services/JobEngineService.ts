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

  register<
    TPayload,
    TResult,
  >(
    name: string,
    handler: JobHandler<
      TPayload,
      TResult
    >,
  ): void {
    this.handlers.register(
      name,
      handler,
    );
  }

  submit<
    TPayload,
    TResult,
  >(
    job: Job<
      TPayload,
      TResult
    >,
  ): void {
    this.queue.enqueue(job);
  }

  async executeNext<
    TPayload,
    TResult,
  >(): Promise<
    JobResult<TResult> | undefined
  > {
    const job =
      this.queue.dequeue<
        TPayload,
        TResult
      >();

    if (!job) {
      return undefined;
    }

    const handler =
      this.handlers.resolve<
        TPayload,
        TResult
      >(job.name);

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
