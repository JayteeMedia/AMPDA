import type { PipelineContext } from "./PipelineContext.js";

export interface PipelineStep {
  readonly name: string;

  execute(
    context: PipelineContext,
  ): Promise<void>;
}
