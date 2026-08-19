import { AgentPipelineStep } from "../AgentPipelineStep.js";

import type { PipelineContext } from "../PipelineContext.js";
import type { PipelineStep } from "../PipelineStep.js";

export class ArtworkStep
  extends AgentPipelineStep
  implements PipelineStep
{
  readonly name = "Artwork";

  async execute(
    context: PipelineContext,
  ): Promise<void> {

    void context;

  }

}
