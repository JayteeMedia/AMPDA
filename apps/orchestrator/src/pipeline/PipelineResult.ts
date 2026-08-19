export interface PipelineResult {
  success: boolean;

  durationMs: number;

  completedSteps: string[];

  failedStep?: string;

  error?: Error;
}
