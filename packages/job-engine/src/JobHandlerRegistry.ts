import type { Job } from "./Job.js";

export type JobHandler<T = unknown> = (
  job: Job<T>,
) => Promise<T>;

export class JobHandlerRegistry {
  private readonly handlers = new Map<
    string,
    JobHandler<any>
  >();

  register<T>(
    name: string,
    handler: JobHandler<T>,
  ): void {
    if (this.handlers.has(name)) {
      throw new Error(
        `Job handler "${name}" already exists.`,
      );
    }

    this.handlers.set(
      name,
      handler as JobHandler<any>,
    );
  }

  resolve<T>(
    name: string,
  ): JobHandler<T> {
    const handler = this.handlers.get(name);

    if (!handler) {
      throw new Error(
        `No handler registered for "${name}".`,
      );
    }

    return handler as JobHandler<T>;
  }

  has(name: string): boolean {
    return this.handlers.has(name);
  }

  unregister(name: string): void {
    this.handlers.delete(name);
  }

  clear(): void {
    this.handlers.clear();
  }

  list(): string[] {
    return [...this.handlers.keys()];
  }
}
