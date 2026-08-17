export type EventHandler<T = unknown> = (payload: T) => void | Promise<void>;

export class EventBus {
  private readonly handlers = new Map<string, EventHandler[]>();

  subscribe<T = unknown>(
    event: string,
    handler: EventHandler<T>,
  ): void {
    const handlers = this.handlers.get(event) ?? [];
    handlers.push(handler as EventHandler);
    this.handlers.set(event, handlers);
  }

  async publish<T = unknown>(
    event: string,
    payload: T,
  ): Promise<void> {
    const handlers = this.handlers.get(event);

    if (!handlers || handlers.length === 0) {
      return;
    }

    for (const handler of handlers) {
      await handler(payload);
    }
  }

  clear(): void {
    this.handlers.clear();
  }

  listenerCount(event: string): number {
    return this.handlers.get(event)?.length ?? 0;
  }
}

export const eventBus = new EventBus();
