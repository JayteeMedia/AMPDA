import {
  MetadataGeneratorAgent,
  type MetadataGenerationResult,
} from "@ampda/agent-runtime";

import { AgentIds } from "../../bootstrap/AgentIds.js";

import { AgentPipelineStep } from "../AgentPipelineStep.js";
import { JobFactory } from "../JobFactory.js";

import type { PipelineContext } from "../PipelineContext.js";
import type { PipelineStep } from "../PipelineStep.js";

export class MetadataStep
  extends AgentPipelineStep
  implements PipelineStep
{
  readonly name = "Metadata";

  async execute(
    context: PipelineContext,
  ): Promise<void> {

    const agent =
      this.registry.resolve(
        AgentIds.metadata,
      ) as MetadataGeneratorAgent;

    const job =
      JobFactory.create<
        {
          title: string;
          genre: string;
          mood: string;
          theme: string;
          lyrics: string;
        },
        MetadataGenerationResult
      >(
        {
          title: context.request.title,
          genre: context.request.genre,
          mood: context.request.mood,
          theme: context.request.theme,
          lyrics: context.lyrics ?? "",
        },
        "Metadata",
      );

    const result =
      await agent.execute(job);

    context.metadata =
      result;

  }

}
