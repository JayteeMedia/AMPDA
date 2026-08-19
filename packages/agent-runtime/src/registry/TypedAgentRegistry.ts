import { AgentRegistry } from "./AgentRegistry.js";

import type { Agent } from "../agent/Agent.js";

export class TypedAgentRegistry {

  constructor(
    private readonly registry: AgentRegistry,
  ) {}

  resolve<T extends Agent>(
    id: string,
  ): T {

    return this.registry.resolve(
      id,
    ) as T;

  }

}
