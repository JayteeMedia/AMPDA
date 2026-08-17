import type { Workflow } from "./Workflow.js";

export class WorkflowRegistry {
  private readonly workflows =
    new Map<string, Workflow>();

  register(
    workflow: Workflow,
  ): void {
    this.workflows.set(
      workflow.name,
      workflow,
    );
  }

  resolve(
    name: string,
  ): Workflow {
    const workflow =
      this.workflows.get(name);

    if (!workflow) {
      throw new Error(
        `Workflow '${name}' is not registered.`,
      );
    }

    return workflow;
  }

  has(
    name: string,
  ): boolean {
    return this.workflows.has(name);
  }

  remove(
    name: string,
  ): boolean {
    return this.workflows.delete(name);
  }

  clear(): void {
    this.workflows.clear();
  }

  size(): number {
    return this.workflows.size;
  }

  list(): Workflow[] {
    return [
      ...this.workflows.values(),
    ];
  }
}
