import type { PipelineContext } from "./PipelineContext.js";
import type { PipelineResult } from "./PipelineResult.js";
import type { PipelineStep } from "./PipelineStep.js";

export class PipelineExecutor {

  constructor(
    private readonly steps: PipelineStep[],
  ) {}

  async execute(
    context: PipelineContext,
  ): Promise<PipelineResult> {

    const started = Date.now();

    const completedSteps: string[] = [];

    try {

      for (const step of this.steps) {

        await step.execute(context);

        completedSteps.push(step.name);

      }

      return {
        success: true,
        durationMs: Date.now() - started,
        completedSteps,
      };

    } catch (error) {

      return {
        success: false,
        durationMs: Date.now() - started,
        completedSteps,
        failedStep: completedSteps.length < this.steps.length
          ? this.steps[completedSteps.length].name
          : undefined,
        error: error as Error,
      };

    }

  }

}
