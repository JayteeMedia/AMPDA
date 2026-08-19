import {
  PromptBuilder,
  PromptManager,
} from "@ampda/prompts";

import type {
  PromptGenerationRequest,
} from "@ampda/agent-runtime";

import { OpenAIClient } from "./OpenAIClient.js";

export class OpenAIMusicPromptProvider {

  constructor(
    private readonly client: OpenAIClient,
    private readonly prompts: PromptManager,
  ) {}

  async generate(
    request: PromptGenerationRequest,
  ): Promise<string> {

    const builder =
      new PromptBuilder(
        this.prompts,
      );

    const systemPrompt =
      await builder
        .setMany({

          title:
            request.title ?? "Untitled",

          genre:
            request.genre,

          mood:
            request.mood,

          theme:
            request.theme,

        })
        .buildAgentPrompt(
          "music",
        );

    return (
      await this.client.generateChat([
        {
          role: "system",
          content: systemPrompt,
        },
      ])
    ).trim();

  }

}
