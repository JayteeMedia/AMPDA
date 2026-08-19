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

        console.log("");
        console.log(`▶ ${step.name}`);

        const stepStarted =
          Date.now();

        await step.execute(
          context,
        );

        const elapsed =
          Date.now() -
          stepStarted;

        console.log(
          `✔ ${step.name} (${elapsed} ms)`,
        );

        completedSteps.push(
          step.name,
        );

      }

      const total =
        Date.now() -
        started;

      console.log("");
      console.log(
        `✔ Pipeline completed (${total} ms)`,
      );

      return {

        success: true,

        durationMs: total,

        completedSteps,

      };

    } catch (error) {

      const total =
        Date.now() -
        started;

      const failedStep =
        completedSteps.length <
        this.steps.length
          ? this.steps[
              completedSteps.length
            ].name
          : undefined;

      console.error("");
      console.error(
        `✖ Pipeline failed in step: ${failedStep}`,
      );

      console.error(error);

      return {

        success: false,

        durationMs: total,

        completedSteps,

        failedStep,

        error: error as Error,

      };

    }

  }

}
