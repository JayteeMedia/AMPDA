import type { Job } from "@ampda/job-engine";

import { AgentExecutor } from "./AgentExecutor.js";
import { AgentRegistry } from "../registry/AgentRegistry.js";

export class AgentJobDispatcher {
  constructor(
    private readonly registry: AgentRegistry,
    private readonly executor: AgentExecutor = new AgentExecutor(),
  ) {}

  async dispatch<TPayload, TResult>(
    agentId: string,
    job: Job<TPayload, TResult>,
  ): Promise<TResult> {
    const agent =
      this.registry.resolve<TPayload, TResult>(
        agentId,
      );

    return this.executor.execute(
      agent,
      job,
    );
  }
}
