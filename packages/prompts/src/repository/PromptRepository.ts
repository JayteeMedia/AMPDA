import { PromptLoader } from "../loader/PromptLoader.js";

export interface PromptRepositoryOptions {
  loader: PromptLoader;
  promptPack: string;
}

export class PromptRepository {

  constructor(
    private readonly options: PromptRepositoryOptions,
  ) {}

  async get(
    category: string,
    name: string,
  ): Promise<string> {

    try {

      return await this.options.loader.load(
        "packs",
        this.options.promptPack,
        category,
        name,
      );

    } catch {

      return this.options.loader.load(
        "packs",
        "default",
        category,
        name,
      );

    }

  }

}
