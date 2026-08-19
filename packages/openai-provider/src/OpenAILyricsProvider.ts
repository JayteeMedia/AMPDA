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
    private readonly _prompts: PromptManager,
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
    console.log("");

    const lyrics =
      await this.client.generateChat([
        {
          role: "system",
          content:
            "You are a professional hip hop songwriter. Return only complete song lyrics.",
        },
        {
          role: "user",
          content: [
            `Title: ${request.title ?? "Untitled"}`,
            `Genre: ${request.genre}`,
            `Mood: ${request.mood}`,
            `Theme: ${request.theme}`,
            "",
            "Write complete song lyrics.",
            "Return only the lyrics.",
          ].join("\n"),
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
