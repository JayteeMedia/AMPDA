import type { WorkflowPlan } from "./WorkflowPlan.js";

export interface PlannerRequest {

  title?: string;

  genre: string;

  mood: string;

  theme: string;

}

export interface PlannerProvider {

  generate(
    request: PlannerRequest,
  ): Promise<WorkflowPlan>;

}
