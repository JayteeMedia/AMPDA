import type { Job } from "@ampda/job-engine";

import { BaseAgent } from "../agent/BaseAgent.js";

export interface SongRequest {
  title?: string;

  genre: string;

  theme: string;

  mood: string;
}

export interface WorkflowPlan {
  steps: string[];
}

export class PlannerAgent
  extends BaseAgent<
    SongRequest,
    WorkflowPlan
  >
{
  async execute(
    job: Job<
      SongRequest,
      WorkflowPlan
    >,
  ): Promise<WorkflowPlan> {
    const request =
      job.payload;

    const steps: string[] = [];

    steps.push(
      "Generate Lyrics",
    );

    steps.push(
      "Generate Music Prompt",
    );

    steps.push(
      "Generate Artwork Prompt",
    );

    steps.push(
      "Generate Metadata",
    );

    steps.push(
      "Export Project",
    );

    return {
      steps,
    };
  }
}
