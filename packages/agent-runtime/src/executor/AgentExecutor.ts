import type { Job } from "@ampda/job-engine";

import type { Agent } from "../agent/Agent.js";
import { AgentStatus } from "../types/AgentStatus.js";

export class AgentExecutor {

  async execute<
    TPayload,
    TResult,
  >(
    agent: Agent<TPayload, TResult>,
    job: Job<TPayload, TResult>,
  ): Promise<TResult> {

    if (agent.status === AgentStatus.Stopped) {
      throw new Error(
        `Agent "${agent.context.id}" is stopped and cannot execute jobs.`,
      );
    }

    if (agent.status === AgentStatus.Paused) {
      throw new Error(
        `Agent "${agent.context.id}" is paused and cannot execute jobs.`,
      );
    }

    if (agent.status === AgentStatus.Idle) {
      await agent.start();
    }

    if (agent.status !== AgentStatus.Running) {
      throw new Error(
        `Agent "${agent.context.id}" is not running.`,
      );
    }

    return agent.execute(job);
  }
}
