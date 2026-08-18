import OpenAI from "openai";
import { config } from "@ampda/config";

export class OpenAIClient {
  private openai: OpenAI;
  private model: string;

  constructor() {
    this.model = config.OPENAI_MODEL || "llama3"; // Default model

    this.openai = new OpenAI({
      apiKey: config.OPENAI_API_KEY || "dummy", // Dummy key for local endpoints
      baseURL: config.OPENAI_BASE_URL || "http://localhost:11434/v1", // Default to Ollama local endpoint
      maxRetries: 3,
    });
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
      if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt });
      }
      messages.push({ role: "user", content: prompt });

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages,
      });

      return response.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("[OpenAIClient] Error generating text:", error);
      throw new Error(`OpenAI generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
