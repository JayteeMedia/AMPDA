import type { Job } from "@ampda/job-engine";

import type { AgentContext } from "../context/AgentContext.js";
import type { AgentStatus } from "../types/AgentStatus.js";

export interface Agent<
  TPayload = unknown,
  TResult = unknown,
> {
  readonly context: AgentContext;

  readonly status: AgentStatus;

  start(): Promise<void>;

  stop(): Promise<void>;

  pause(): Promise<void>;

  resume(): Promise<void>;

  execute(
    job: Job<TPayload, TResult>,
  ): Promise<TResult>;
}
