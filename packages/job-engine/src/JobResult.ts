export interface JobResult<T = unknown> {
  success: boolean;

  data?: T;

  error?: Error;

  startedAt: Date;

  finishedAt: Date;

  durationMs: number;
}
