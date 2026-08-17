import type { Job } from "@ampda/job-engine";

import type { Agent } from "../agent/Agent.js";

export class AgentExecutor {
  async execute<
    TPayload,
    TResult,
  >(
    agent: Agent<
      TPayload,
      TResult
    >,
    job: Job<
      TPayload,
      TResult
    >,
  ): Promise<TResult> {
    return agent.execute(job);
  }
}
