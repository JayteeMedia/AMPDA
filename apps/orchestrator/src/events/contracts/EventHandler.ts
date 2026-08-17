import type { Event } from "./Event.js";

export type EventHandler<T = unknown> =
  (event: Event<T>) => void | Promise<void>;
