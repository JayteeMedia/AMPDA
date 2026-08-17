import type { WorkflowContext } from "./WorkflowContext.js";
import type { WorkflowId } from "./WorkflowId.js";
import type { WorkflowResult } from "./WorkflowResult.js";
import type { WorkflowStep } from "./WorkflowStep.js";

import { WorkflowState } from "./WorkflowState.js";
import { WorkflowTrigger } from "./WorkflowTrigger.js";

export interface WorkflowOptions {
  id: WorkflowId;

  name: string;

  trigger?: WorkflowTrigger;

  context?: WorkflowContext;

  steps?: WorkflowStep[];
}

export class Workflow {
  public readonly id: WorkflowId;

  public readonly name: string;

  public readonly trigger: WorkflowTrigger;

  public readonly createdAt: Date;

  public readonly context: WorkflowContext;

  public readonly steps: WorkflowStep[];

  public state: WorkflowState;

  public result?: WorkflowResult;

  constructor(
    options: WorkflowOptions,
  ) {
    this.id = options.id;

    this.name = options.name;

    this.trigger =
      options.trigger ??
      WorkflowTrigger.Manual;

    this.createdAt = new Date();

    this.context =
      options.context ?? {
        metadata: {},
      };

    this.steps =
      options.steps ?? [];

    this.state =
      WorkflowState.Pending;
  }

  start(): void {
    this.state =
      WorkflowState.Running;
  }

  complete(
    result: WorkflowResult,
  ): void {
    this.result = result;

    this.state =
      WorkflowState.Completed;
  }

  fail(
    result: WorkflowResult,
  ): void {
    this.result = result;

    this.state =
      WorkflowState.Failed;
  }

  cancel(): void {
    this.state =
      WorkflowState.Cancelled;
  }

  pause(): void {
    this.state =
      WorkflowState.Paused;
  }

  resume(): void {
    this.state =
      WorkflowState.Running;
  }

  isFinished(): boolean {
    return (
      this.state ===
        WorkflowState.Completed ||
      this.state ===
        WorkflowState.Failed ||
      this.state ===
        WorkflowState.Cancelled
    );
  }
}
