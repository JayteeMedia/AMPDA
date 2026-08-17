import type { Job } from "@ampda/job-engine";

import type { AgentContext } from "../context/AgentContext.js";
import type { AgentStatus } from "../types/AgentStatus.js";

export interface Agent {
  readonly context: AgentContext;

  readonly status: AgentStatus;

  start(): Promise<void>;

  stop(): Promise<void>;

  pause(): Promise<void>;

  resume(): Promise<void>;

  execute<T>(
    job: Job<T>,
  ): Promise<T>;
}
