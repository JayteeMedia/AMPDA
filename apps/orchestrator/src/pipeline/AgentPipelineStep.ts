import { AgentRegistry } from "@ampda/agent-runtime";

export abstract class AgentPipelineStep {

  constructor(
    protected readonly registry: AgentRegistry,
  ) {}

}
