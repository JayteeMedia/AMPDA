import type {
  ChatProvider,
} from "../../client/ChatProvider.js";

import type {
  ChatRequest,
} from "../../client/ChatRequest.js";

import type {
  ChatResponse,
} from "../../client/ChatResponse.js";

export class OllamaClient
  implements ChatProvider
{
  constructor(

    private readonly baseUrl =
      process.env.OLLAMA_BASE_URL ??
      "http://localhost:11434",

  ) {}

  async chat(
    request: ChatRequest,
  ): Promise<ChatResponse> {

    const response =
      await fetch(

        `${this.baseUrl}/api/chat`,

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

          },

          body: JSON.stringify({

            model:
              request.model,

            messages:
              request.messages,

            think:
              request.think ?? false,

            stream:
              request.stream ?? false,

          }),

        },

      );

    if (!response.ok) {

      const text =
        await response.text();

      throw new Error(

        `Ollama Error (${response.status})\n${text}`,

      );

    }

    const json =
      await response.json() as {

        message?: {

          content?: string;

        };

      };

    return {

      content:
        json.message?.content ?? "",

    };

  }

}
