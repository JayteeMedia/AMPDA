import { AgentPipelineStep } from "../AgentPipelineStep.js";

import type { PipelineContext } from "../PipelineContext.js";
import type { PipelineStep } from "../PipelineStep.js";

export class MusicStep
  extends AgentPipelineStep
  implements PipelineStep
{
  readonly name = "Music";

  async execute(
    context: PipelineContext,
  ): Promise<void> {

    void context;

  }

}
