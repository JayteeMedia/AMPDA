import type { Job } from "@ampda/job-engine";

import type { Agent } from "./Agent.js";
import type { AgentContext } from "../context/AgentContext.js";

import { AgentStatus } from "../types/AgentStatus.js";

export abstract class BaseAgent
  implements Agent
{
  public status =
    AgentStatus.Idle;

  constructor(
    public readonly context: AgentContext,
  ) {}

  async start(): Promise<void> {
    this.status = AgentStatus.Running;
  }

  async stop(): Promise<void> {
    this.status = AgentStatus.Stopped;
  }

  async pause(): Promise<void> {
    this.status = AgentStatus.Paused;
  }

  async resume(): Promise<void> {
    this.status = AgentStatus.Running;
  }

  abstract execute<T>(
    job: Job<T>,
  ): Promise<T>;
}
