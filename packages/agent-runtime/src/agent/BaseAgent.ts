import type { Job } from "@ampda/job-engine";

import type { Agent } from "./Agent.js";
import type { AgentContext } from "../context/AgentContext.js";

import { AgentStatus } from "../types/AgentStatus.js";

export abstract class BaseAgent<
  TPayload = unknown,
  TResult = unknown,
> implements Agent<TPayload, TResult> {
  public status =
    AgentStatus.Idle;

  constructor(
    public readonly context: AgentContext,
  ) {}

  async start(): Promise<void> {
    this.status =
      AgentStatus.Running;
  }

  async stop(): Promise<void> {
    this.status =
      AgentStatus.Stopped;
  }

  async pause(): Promise<void> {
    this.status =
      AgentStatus.Paused;
  }

  async resume(): Promise<void> {
    this.status =
      AgentStatus.Running;
  }

  abstract execute(
    job: Job<TPayload, TResult>,
  ): Promise<TResult>;
}
