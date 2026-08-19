import {
  PlannerAgent,
  type WorkflowPlan,
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
        typeof context.request,
        WorkflowPlan
      >(
        context.request,
        "Planner",
      );

    const result =
      await agent.execute(job);

    context.metadata = {
      ...(context.metadata ?? {}),
      workflowPlan: result,
    };

  }

}
