import type { Job } from "./Job.js";
import type {
  JobEvent,
  JobEventHandler,
} from "./JobEvents.js";
import type { JobResult } from "./JobResult.js";

import {
  JobEventType,
} from "./JobEvents.js";

import { JobExecutor } from "./JobExecutor.js";
import { JobHandlerRegistry } from "./JobHandlerRegistry.js";
import { JobQueue } from "./JobQueue.js";
import { JobStatus } from "./JobStatus.js";

export class JobService {

  private readonly queue: JobQueue;

  private readonly registry:
    JobHandlerRegistry;

  private readonly executor:
    JobExecutor;

  private readonly listeners =
    new Set<
      JobEventHandler<any, any>
    >();

  constructor(
    queue = new JobQueue(),
    registry =
      new JobHandlerRegistry(),
    executor =
      new JobExecutor(),
  ) {
    this.queue =
      queue;

    this.registry =
      registry;

    this.executor =
      executor;
  }

  registerHandler<
    TPayload,
    TResult,
  >(
    name: string,
    handler: (
      job: Job<
        TPayload,
        TResult
      >,
    ) => Promise<TResult>,
  ): void {

    this.registry.register(
      name,
      handler,
    );
  }

  subscribe(
    listener: JobEventHandler,
  ): () => void {

    this.listeners.add(
      listener,
    );

    return () => {
      this.listeners.delete(
        listener,
      );
    };
  }

  enqueue<
    TPayload,
    TResult,
  >(
    job: Job<
      TPayload,
      TResult
    >,
  ): void {

    if (
      job.status !==
      JobStatus.Pending
    ) {
      throw new Error(
        `Job '${job.id}' cannot be queued from status '${job.status}'.`,
      );
    }

    this.queue.enqueue(
      job,
    );

    this.emit({
      type:
        JobEventType.Queued,

      job,

      timestamp:
        new Date(),

      metadata: {},
    });
  }

  async processNext<
    TPayload,
    TResult,
  >(): Promise<
    JobResult<TResult>
    | undefined
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
      this.registry.resolve<
        TPayload,
        TResult
      >(job.name);

    const result =
      await this.executor.execute(
        job,
        handler,
      );

    return result;
  }

  queueSize(): number {
    return this.queue.size();
  }

  hasHandler(
    name: string,
  ): boolean {
    return this.registry.has(
      name,
    );
  }

  private emit(
    event: JobEvent,
  ): void {

    for (
      const listener
      of this.listeners
    ) {
      try {

        const result =
          listener(event);

        if (
          result instanceof Promise
        ) {
          void result.catch(
            () => {
              // Listener failures
              // must not affect jobs.
            },
          );
        }

      } catch {
        // Listener failures
        // must not affect jobs.
      }
    }
  }
}
