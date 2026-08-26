import type { Job } from "@ampda/job-engine";

import { BaseAgent } from "../agent/BaseAgent.js";

import type {
  PlannerProvider,
  PlannerRequest,
} from "@ampda/planner";

import type {
  WorkflowPlan,
} from "@ampda/planner";

export interface SongRequest {

  title?: string;

  genre: string;

  mood: string;

  theme: string;

}

export class PlannerAgent
  extends BaseAgent<
    SongRequest,
    WorkflowPlan
  >
{
  constructor(

    context: ConstructorParameters<
      typeof BaseAgent<
        SongRequest,
        WorkflowPlan
      >
    >[0],

    private readonly provider:
      PlannerProvider,

  ) {

    super(
      context,
    );

  }

  async execute(

    job: Job<
      SongRequest,
      WorkflowPlan
    >,

  ): Promise<WorkflowPlan> {

    const request: PlannerRequest = {

      title:
        job.payload.title,

      genre:
        job.payload.genre,

      mood:
        job.payload.mood,

      theme:
        job.payload.theme,

    };

    return this.provider.generate(
      request,
    );

  }

}
