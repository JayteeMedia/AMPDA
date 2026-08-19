import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export interface PromptLoaderOptions {
  rootDirectory: string;

  cache?: boolean;
}

export class PromptLoader {
  private readonly cache = new Map<string, string>();

  private readonly rootDirectory: string;

  private readonly useCache: boolean;

  constructor(
    options: PromptLoaderOptions,
  ) {
    this.rootDirectory =
      resolve(options.rootDirectory);

    this.useCache =
      options.cache ?? true;
  }

  async load(
    ...segments: string[]
  ): Promise<string> {

    const file =
      resolve(
        this.rootDirectory,
        ...segments,
      );

    if (
      this.useCache &&
      this.cache.has(file)
    ) {
      return this.cache.get(file)!;
    }

    let prompt: string;

    try {

      prompt =
        await readFile(
          file,
          "utf8",
        );

    } catch (error) {

      throw new Error(
        `Prompt not found: ${file}`,
        {
          cause: error,
        },
      );

    }

    if (this.useCache) {
      this.cache.set(
        file,
        prompt,
      );
    }

    return prompt;

  }

  has(
    ...segments: string[]
  ): boolean {

    const file =
      resolve(
        this.rootDirectory,
        ...segments,
      );

    return this.cache.has(
      file,
    );

  }

  clear(): void {

    this.cache.clear();

  }

  invalidate(
    ...segments: string[]
  ): void {

    const file =
      resolve(
        this.rootDirectory,
        ...segments,
      );

    this.cache.delete(
      file,
    );

  }

}
