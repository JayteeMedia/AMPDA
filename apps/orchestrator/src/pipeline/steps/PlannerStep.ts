import {
  PlannerAgent,
  type WorkflowPlan,
  type SongRequest,
} from "@ampda/agent-runtime";

import { AgentIds } from "../../bootstrap/AgentIds.js";

import { AgentPipelineStep } from "../AgentPipelineStep.js";
import { JobFactory } from "../JobFactory.js";

import type { PipelineContext } from "../PipelineContext.js";
import type { PipelineStep } from "../PipelineStep.js";

export class PlannerStep
  extends AgentPipelineStep
  implements PipelineStep
{
  readonly name = "Planner";

  async execute(
    context: PipelineContext,
  ): Promise<void> {

    const agent =
      this.registry.resolve(
        AgentIds.planner,
      ) as PlannerAgent;

    const job =
      JobFactory.create<
        SongRequest,
        WorkflowPlan
      >(
        {
          title:
            context.request.title,

          genre:
            context.request.genre,

          mood:
            context.request.mood,

          theme:
            context.request.theme,
        },
        "Planner",
      );

    const result =
      await agent.execute(
        job,
      );

    context.workflowPlan =
      result;

  }

}
