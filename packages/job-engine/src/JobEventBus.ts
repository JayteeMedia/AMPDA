import type {
  JobEvent,
  JobEventHandler,
} from "./JobEvents.js";

import {
  JobEventType,
} from "./JobEvents.js";

export class JobEventBus {

  private readonly handlers =
    new Map<
      JobEventType,
      Set<JobEventHandler<any, any>>
    >();

  subscribe<
    TPayload,
    TResult,
  >(
    type: JobEventType,
    handler: JobEventHandler<
      TPayload,
      TResult
    >,
  ): () => void {

    let handlers =
      this.handlers.get(type);

    if (!handlers) {
      handlers =
        new Set<
          JobEventHandler<any, any>
        >();

      this.handlers.set(
        type,
        handlers,
      );
    }

    handlers.add(handler);

    return () => {

      handlers?.delete(handler);

      if (
        handlers &&
        handlers.size === 0
      ) {
        this.handlers.delete(type);
      }
    };
  }

  async publish<
    TPayload,
    TResult,
  >(
    event: JobEvent<
      TPayload,
      TResult
    >,
  ): Promise<void> {

    const handlers =
      this.handlers.get(
        event.type,
      );

    if (!handlers) {
      return;
    }

    /*
     * Event listeners are observers.
     *
     * A listener failure must never
     * corrupt the job lifecycle.
     *
     * Snapshot the listeners so that
     * subscribe/unsubscribe operations
     * during publication do not mutate
     * the current dispatch cycle.
     */
    const listeners = Array.from(
      handlers,
    );

    for (const handler of listeners) {
      try {
        await handler(event);
      } catch (error) {
        /*
         * Listener failures are isolated
         * from the producer.
         *
         * Do not rethrow.
         */
        console.error(
          `[JobEventBus] Listener failed for ${event.type}`,
          error,
        );
      }
    }
  }

  listenerCount(
    type: JobEventType,
  ): number {

    return (
      this.handlers
        .get(type)
        ?.size ?? 0
    );
  }

  clear(
    type?: JobEventType,
  ): void {

    if (type) {
      this.handlers.delete(type);
      return;
    }

    this.handlers.clear();
  }
}
