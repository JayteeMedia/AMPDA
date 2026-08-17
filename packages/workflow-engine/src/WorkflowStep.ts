import type { WorkflowContext } from "./WorkflowContext.js";
import type { WorkflowStepResult } from "./WorkflowStepResult.js";

export type WorkflowStepHandler<
  T = unknown,
> = (
  context: WorkflowContext,
) => Promise<T>;

export interface WorkflowStep {
  id: string;

  name: string;

  dependsOn: string[];

  timeoutMs: number;

  retries: number;

  handler: WorkflowStepHandler;

  metadata: Record<string, unknown>;
}

export interface ExecutedWorkflowStep
  extends WorkflowStep {
  result?: WorkflowStepResult;
}
