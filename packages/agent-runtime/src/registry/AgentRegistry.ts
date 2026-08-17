import type { Agent } from "../agent/Agent.js";

export class AgentRegistry {
  private readonly agents = new Map<
    string,
    Agent
  >();

  register(agent: Agent): void {
    const id = agent.context.id;

    if (this.agents.has(id)) {
      throw new Error(
        `Agent "${id}" is already registered.`,
      );
    }

    this.agents.set(id, agent);
  }

  resolve(id: string): Agent {
    const agent = this.agents.get(id);

    if (!agent) {
      throw new Error(
        `Agent "${id}" not found.`,
      );
    }

    return agent;
  }

  has(id: string): boolean {
    return this.agents.has(id);
  }

  unregister(id: string): void {
    this.agents.delete(id);
  }

  clear(): void {
    this.agents.clear();
  }

  list(): Agent[] {
    return [...this.agents.values()];
  }
}
