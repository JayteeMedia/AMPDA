import {
  LyricsAgent,
  type LyricsResult,
} from "@ampda/agent-runtime";

import { AgentIds } from "../../bootstrap/AgentIds.js";

import { AgentPipelineStep } from "../AgentPipelineStep.js";
import { JobFactory } from "../JobFactory.js";

import type { PipelineContext } from "../PipelineContext.js";
import type { PipelineStep } from "../PipelineStep.js";

export class LyricsStep
  extends AgentPipelineStep
  implements PipelineStep
{
  readonly name = "Lyrics";

  async execute(
    context: PipelineContext,
  ): Promise<void> {

    const agent =
      this.registry.resolve(
        AgentIds.lyrics,
      ) as LyricsAgent;

    const job =
      JobFactory.create<
        typeof context.request,
        LyricsResult
      >(
        context.request,
        "Lyrics",
      );

    const result =
      await agent.execute(job);

    context.project.lyrics =
      result.lyrics;

    context.project.updatedAt =
      new Date();

  }

}
