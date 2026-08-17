import type { Job } from "@ampda/job-engine";

import type { Agent } from "../agent/Agent.js";

export class AgentExecutor {
  async execute<T>(
    agent: Agent,
    job: Job<T>,
  ): Promise<T> {
    return agent.execute(job);
  }
}
