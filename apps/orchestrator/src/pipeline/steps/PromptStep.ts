import {
  PromptAgent,
  type PromptResult,
} from "@ampda/agent-runtime";

import { AgentIds } from "../../bootstrap/AgentIds.js";

import { AgentPipelineStep } from "../AgentPipelineStep.js";
import { JobFactory } from "../JobFactory.js";

import type { PipelineContext } from "../PipelineContext.js";
import type { PipelineStep } from "../PipelineStep.js";

export class PromptStep
  extends AgentPipelineStep
  implements PipelineStep
{
  readonly name = "Prompt";

  async execute(
    context: PipelineContext,
  ): Promise<void> {

    const agent =
      this.registry.resolve(
        AgentIds.prompt,
      ) as PromptAgent;

    const job =
      JobFactory.create<
        {
          title?: string;

          genre: string;

          theme: string;

          mood: string;

          lyrics: string;
        },
        PromptResult
      >(
        {
          title:
            context.request.title,

          genre:
            context.request.genre,

          theme:
            context.request.theme,

          mood:
            context.request.mood,

          lyrics:
            context.project.lyrics ?? "",
        },
        "Prompt",
      );

    const result =
      await agent.execute(
        job,
      );

    context.project.musicPrompt =
      result.musicPrompt;

    context.project.artworkPrompt =
      result.artworkPrompt;

    context.project.updatedAt =
      new Date();

  }

}
