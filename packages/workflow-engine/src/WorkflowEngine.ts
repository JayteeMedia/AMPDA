import type { Workflow } from "./Workflow.js";
import type { WorkflowResult } from "./WorkflowResult.js";

import { WorkflowExecutor } from "./WorkflowExecutor.js";
import { WorkflowRegistry } from "./WorkflowRegistry.js";

export class WorkflowEngine {
  public readonly registry =
    new WorkflowRegistry();

  public readonly executor =
    new WorkflowExecutor();

  register(
    workflow: Workflow,
  ): void {
    this.registry.register(workflow);
  }

  async execute(
    name: string,
  ): Promise<WorkflowResult> {
    const workflow =
      this.registry.resolve(name);

    return this.executor.execute(
      workflow,
    );
  }

  has(
    name: string,
  ): boolean {
    return this.registry.has(name);
  }

  remove(
    name: string,
  ): boolean {
    return this.registry.remove(name);
  }

  clear(): void {
    this.registry.clear();
  }

  list(): Workflow[] {
    return this.registry.list();
  }

  size(): number {
    return this.registry.size();
  }
}

export const workflowEngine =
  new WorkflowEngine();
