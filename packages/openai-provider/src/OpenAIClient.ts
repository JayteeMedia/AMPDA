import OpenAI from "openai";

import { config } from "@ampda/config";

export class OpenAIClient {

  private readonly client: OpenAI;

  private readonly model: string;

  private readonly debugPrompts: boolean;

  constructor() {

    if (!config.OPENAI_MODEL) {

      throw new Error(
        [
          "OPENAI_MODEL is not configured.",
          "",
          "Example:",
          "$env:OPENAI_MODEL=\"qwen3.5:4b\"",
        ].join("\n"),
      );

    }

    this.model =
      config.OPENAI_MODEL;

    this.debugPrompts =
      process.env.AMPDA_DEBUG_PROMPTS ===
      "true";

    this.client =
      new OpenAI({

        apiKey:
          config.OPENAI_API_KEY ??
          "ollama",

        baseURL:
          config.OPENAI_BASE_URL ??
          "http://localhost:11434/v1",

        maxRetries: 1,

      });

  }

  async generateChat(

    messages: OpenAI.Chat.ChatCompletionMessageParam[],

  ): Promise<string> {

    console.log("");
    console.log("==================================================");
    console.log("LLM REQUEST");
    console.log("==================================================");
    console.log(`Model      : ${this.model}`);
    console.log(
      `Endpoint   : ${
        config.OPENAI_BASE_URL ??
        "http://localhost:11434/v1"
      }`,
    );
    console.log(
      `Messages   : ${messages.length}`,
    );
    console.log("");

    if (this.debugPrompts) {

      console.log(
        JSON.stringify(
          {
            model: this.model,
            messages,
          },
          null,
          2,
        ),
      );

    } else {

      const systemMessage =
        messages.find(
          message =>
            message.role === "system",
        );

      const userMessage =
        messages.find(
          message =>
            message.role === "user",
        );

      const systemPreview =
        typeof systemMessage?.content ===
        "string"
          ? systemMessage.content
              .split("\n")[0]
          : "<non-text>";

      const userPreview =
        typeof userMessage?.content ===
        "string"
          ? userMessage.content
              .replace(/\s+/g, " ")
              .slice(0, 120)
          : "<non-text>";

      console.log(
        `System     : ${systemPreview}`,
      );

      console.log(
        `User       : ${userPreview}${
          userPreview.length >= 120
            ? "..."
            : ""
        }`,
      );

    }

    console.log("==================================================");
    console.log("");

    const started =
      Date.now();

    const completion =
      await this.client.chat.completions.create({

        model:
          this.model,

        messages,

      });

    const elapsed =
      Date.now() -
      started;

    console.log("");
    console.log("==================================================");
    console.log("LLM RESPONSE");
    console.log("==================================================");
    console.log(
      `Elapsed : ${elapsed} ms`,
    );

    console.log("");

    if (this.debugPrompts) {

      console.log(
        JSON.stringify(
          completion,
          null,
          2,
        ),
      );

    } else {

      const text =
        completion.choices[0]
          ?.message
          ?.content ??
        "";

      console.log(
        `Characters : ${text.length}`,
      );

      console.log("");

      console.log(
        text.length > 500
          ? `${text.substring(
              0,
              500,
            )}...`
          : text,
      );

    }

    console.log("==================================================");
    console.log("");

    return (
      completion.choices[0]
        ?.message
        ?.content ??
      ""
    );

  }

}
