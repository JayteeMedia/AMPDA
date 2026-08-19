import { config } from "@ampda/config";

export class OpenAIClient {

  private readonly baseUrl: string;

  private readonly model: string;

  constructor() {

    if (!config.OPENAI_MODEL) {

      throw new Error(
        "OPENAI_MODEL is not configured.",
      );

    }

    this.model =
      config.OPENAI_MODEL;

    this.baseUrl =
      (
        config.OPENAI_BASE_URL ??
        "http://localhost:11434"
      ).replace(/\/v1$/, "");

  }

  async generateChat(
    messages: {
      role: "system" | "user" | "assistant";
      content: string;
    }[],
  ): Promise<string> {

    console.log("");
    console.log("=========================================");
    console.log("OLLAMA REQUEST");
    console.log("=========================================");

    const body = {

      model: this.model,

      messages,

      think: false,

      stream: false,

    };

    console.log(
      JSON.stringify(
        body,
        null,
        2,
      ),
    );

    const started =
      Date.now();

    const response =
      await fetch(

        `${this.baseUrl}/api/chat`,

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

          },

          body:
            JSON.stringify(body),

        },

      );

    if (!response.ok) {

      throw new Error(
        await response.text(),
      );

    }

    const json =
      await response.json() as {

        message?: {

          content?: string;

        };

      };

    console.log("");
    console.log("=========================================");
    console.log("OLLAMA RESPONSE");
    console.log("=========================================");
    console.log(
      `Elapsed: ${Date.now() - started} ms`,
    );
    console.log("=========================================");
    console.log("");

    return (
      json.message?.content ??
      ""
    );

  }

}
