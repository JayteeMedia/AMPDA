import type { Event } from "./contracts/Event.js";
import type { EventHandler } from "./contracts/EventHandler.js";

export class EventBus {
  private readonly handlers = new Map<string, EventHandler[]>();

  subscribe<T>(
    type: string,
    handler: EventHandler<T>,
  ): void {
    const handlers = this.handlers.get(type) ?? [];

    handlers.push(handler as EventHandler);

    this.handlers.set(type, handlers);
  }

  async publish<T>(
    event: Event<T>,
  ): Promise<void> {
    const handlers = this.handlers.get(event.type);

    if (!handlers) {
      return;
    }

    for (const handler of handlers) {
      await handler(event);
    }
  }

  clear(): void {
    this.handlers.clear();
  }

  listenerCount(type: string): number {
    return this.handlers.get(type)?.length ?? 0;
  }
}

export const eventBus = new EventBus();
