import {
  PromptManager,
} from "../manager/PromptManager.js";

import type {
  PromptVariables,
} from "../template/PromptTemplate.js";

export class PromptBuilder {

  private readonly variables: PromptVariables = {};

  constructor(
    private readonly manager: PromptManager,
  ) {}

  set(
    key: string,
    value: string | number | boolean,
  ): this {

    this.variables[key] = value;

    return this;

  }

  setMany(
    values: PromptVariables,
  ): this {

    Object.assign(
      this.variables,
      values,
    );

    return this;

  }

  async buildAgentPrompt(
    name: string,
  ): Promise<string> {

    return this.manager.renderAgentPrompt(
      name,
      this.variables,
    );

  }

  async buildSystemPrompt(): Promise<string> {

    return this.manager.renderSystemPrompt(
      this.variables,
    );

  }

  clear(): this {

    for (const key of Object.keys(
      this.variables,
    )) {

      delete this.variables[key];

    }

    return this;

  }

}
