import { access } from "node:fs/promises";
import { resolve } from "node:path";

import { PromptLoader } from "../loader/PromptLoader.js";
import { PromptTemplate } from "../template/PromptTemplate.js";

export interface PromptManagerOptions {

  loader: PromptLoader;

  promptPack?: string;

}

export class PromptManager {

  private readonly promptPack: string;

  constructor(
    private readonly options: PromptManagerOptions,
  ) {

    this.promptPack =
      options.promptPack ?? "default";

  }

  async renderAgentPrompt(

    name: string,

    variables: Record<
      string,
      string | number | boolean
    >,

  ): Promise<string> {

    const template =
      await this.loadPrompt(
        "agents",
        `${name}.md`,
      );

    return new PromptTemplate(
      template,
    ).render(
      variables,
    );

  }

  async renderSystemPrompt(

    variables: Record<
      string,
      string | number | boolean
    >,

  ): Promise<string> {

    const template =
      await this.loadPrompt(
        "system",
        "ampda.system.md",
      );

    return new PromptTemplate(
      template,
    ).render(
      variables,
    );

  }

  async renderWorkflowPrompt(

    workflow: string,

    variables: Record<
      string,
      string | number | boolean
    >,

  ): Promise<string> {

    const template =
      await this.loadPrompt(
        "workflows",
        `${workflow}.md`,
      );

    return new PromptTemplate(
      template,
    ).render(
      variables,
    );

  }

  async renderQualityPrompt(

    name: string,

    variables: Record<
      string,
      string | number | boolean
    >,

  ): Promise<string> {

    const template =
      await this.loadPrompt(
        "quality",
        `${name}.md`,
      );

    return new PromptTemplate(
      template,
    ).render(
      variables,
    );

  }

  private async loadPrompt(

    category: string,

    file: string,

  ): Promise<string> {

    const packPath =
      resolve(
        this.options.loader["rootDirectory"],
        "packs",
        this.promptPack,
        category,
        file,
      );

    try {

      await access(
        packPath,
      );

      return this.options.loader.load(
        "packs",
        this.promptPack,
        category,
        file,
      );

    } catch {

      return this.options.loader.load(
        "packs",
        "default",
        category,
        file,
      );

    }

  }

}
