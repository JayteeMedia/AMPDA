export interface WorkflowStepResult<T = unknown> {
  success: boolean;

  data?: T;

  error?: Error;

  startedAt: Date;

  finishedAt: Date;

  durationMs: number;
}
