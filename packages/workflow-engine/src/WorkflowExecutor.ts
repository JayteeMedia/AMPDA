import type { Workflow } from "./Workflow.js";
import type { WorkflowResult } from "./WorkflowResult.js";
import type { WorkflowStepResult } from "./WorkflowStepResult.js";

export class WorkflowExecutor {
  async execute(
    workflow: Workflow,
  ): Promise<WorkflowResult> {
    workflow.start();

    const startedAt = new Date();

    const results: Record<
      string,
      WorkflowStepResult
    > = {};

    try {
      for (const step of workflow.steps) {
        const stepStartedAt = new Date();

        try {
          const data = await step.handler(
            workflow.context,
          );

          const stepFinishedAt =
            new Date();

          results[step.id] = {
            success: true,
            data,
            startedAt: stepStartedAt,
            finishedAt: stepFinishedAt,
            durationMs:
              stepFinishedAt.getTime() -
              stepStartedAt.getTime(),
          };
        } catch (error) {
          const stepFinishedAt =
            new Date();

          results[step.id] = {
            success: false,
            error:
              error instanceof Error
                ? error
                : new Error(
                    String(error),
                  ),
            startedAt: stepStartedAt,
            finishedAt: stepFinishedAt,
            durationMs:
              stepFinishedAt.getTime() -
              stepStartedAt.getTime(),
          };

          throw error;
        }
      }

      const finishedAt = new Date();

      const result: WorkflowResult = {
        success: true,
        steps: results,
        startedAt,
        finishedAt,
        durationMs:
          finishedAt.getTime() -
          startedAt.getTime(),
      };

      workflow.complete(result);

      return result;
    } catch {
      const finishedAt = new Date();

      const result: WorkflowResult = {
        success: false,
        steps: results,
        startedAt,
        finishedAt,
        durationMs:
          finishedAt.getTime() -
          startedAt.getTime(),
      };

      workflow.fail(result);

      return result;
    }
  }
}
