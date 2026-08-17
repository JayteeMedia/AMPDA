import type { Job } from "./Job.js";

export type JobHandler<
  TPayload = unknown,
  TResult = unknown,
> = (
  job: Job<TPayload, TResult>,
) => Promise<TResult>;

export class JobHandlerRegistry {
  private readonly handlers =
    new Map<
      string,
      JobHandler<any, any>
    >();

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
    this.handlers.set(
      name,
      handler,
    );
  }

  resolve<
    TPayload,
    TResult,
  >(
    name: string,
  ): JobHandler<
    TPayload,
    TResult
  > {
    const handler =
      this.handlers.get(name);

    if (!handler) {
      throw new Error(
        `No handler registered for '${name}'.`,
      );
    }

    return handler as JobHandler<
      TPayload,
      TResult
    >;
  }

  has(
    name: string,
  ): boolean {
    return this.handlers.has(name);
  }

  remove(
    name: string,
  ): boolean {
    return this.handlers.delete(name);
  }

  clear(): void {
    this.handlers.clear();
  }

  size(): number {
    return this.handlers.size;
  }

  list(): string[] {
    return [
      ...this.handlers.keys(),
    ];
  }
}
