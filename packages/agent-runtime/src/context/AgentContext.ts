import type { AgentCapability } from "../types/AgentCapability.js";

export interface AgentContext {
  id: string;

  name: string;

  capabilities: AgentCapability[];

  metadata: Record<string, unknown>;
}
