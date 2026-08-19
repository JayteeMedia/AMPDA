import type {
  LyricsGenerationRequest,
  LyricsGenerationResult,
  LyricsProvider,
} from "./LyricsProvider.js";

import {
  OllamaProvider,
} from "@ampda/ai";

export class OllamaLyricsProvider
  implements LyricsProvider
{
  private readonly ollama =
    new OllamaProvider();

  async generate(
    request: LyricsGenerationRequest,
  ): Promise<LyricsGenerationResult> {

    const response =
      await this.ollama.client.chat({

        model:
          process.env.OPENAI_MODEL ??
          "qwen3.5:4b",

        think: false,

        stream: false,

        messages: [

          {

            role: "system",

            content:
              "You are an expert songwriter. Return only complete song lyrics.",

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

        ],

      });

    return {

      lyrics:
        response.content,

    };

  }

}
