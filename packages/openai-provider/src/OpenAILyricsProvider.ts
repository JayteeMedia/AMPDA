import type {
  LyricsGenerationResult,
  LyricsProvider,
} from "@ampda/agent-runtime";

import {
  PromptManager,
} from "@ampda/prompts";

import { OpenAIClient } from "./OpenAIClient.js";

export class OpenAILyricsProvider
  implements LyricsProvider
{
  constructor(
    private readonly client: OpenAIClient,
    private readonly prompts: PromptManager,
  ) {}

  async generate(
    request: {
      title: string;
      genre: string;
      mood: string;
      theme: string;
    },
  ): Promise<LyricsGenerationResult> {

    console.log("");
    console.log("=========================================");
    console.log("LYRICS PROVIDER");
    console.log("=========================================");
    console.log(request);
    console.log("=========================================");

    const systemPrompt =
      await this.prompts.renderAgentPrompt(
        "lyrics",
        {
          title:
            request.title ?? "Untitled",

          genre:
            request.genre,

          mood:
            request.mood,

          theme:
            request.theme,
        },
      );

    const userPrompt =
      [
        `Song Title: ${request.title ?? "Untitled"}`,
        `Genre: ${request.genre}`,
        `Mood: ${request.mood}`,
        `Theme: ${request.theme}`,
      ].join("\n");

    const lyrics =
      await this.client.generateChat([
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ]);

    console.log("");
    console.log("=========================================");
    console.log("LYRICS GENERATED");
    console.log("=========================================");
    console.log(lyrics);
    console.log("=========================================");
    console.log("");

    return {
      lyrics,
    };

  }

}
