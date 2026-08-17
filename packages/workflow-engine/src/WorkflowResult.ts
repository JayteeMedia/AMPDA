import type { WorkflowStepResult } from "./WorkflowStepResult.js";

export interface WorkflowResult {
  success: boolean;

  steps: Record<
    string,
    WorkflowStepResult
  >;

  startedAt: Date;

  finishedAt: Date;

  durationMs: number;
}
