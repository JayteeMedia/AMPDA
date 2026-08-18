import type { PromptProvider, PromptGenerationRequest, PromptGenerationResult } from "@ampda/agent-runtime";
import { OpenAIClient } from "./OpenAIClient.js";

export class OpenAIPromptProvider implements PromptProvider {
  private client: OpenAIClient;

  constructor(client?: OpenAIClient) {
    this.client = client || new OpenAIClient();
  }

  async generate(request: PromptGenerationRequest): Promise<PromptGenerationResult> {
    const musicPromptInput = `Generate a short prompt to create a ${request.genre} song.
Theme: ${request.theme}
Mood: ${request.mood}
Lyrics snippet:
${request.lyrics.substring(0, 100)}...`;

    const artworkPromptInput = `Generate a short prompt to create album artwork for a ${request.genre} song.
Theme: ${request.theme}
Mood: ${request.mood}
Title: ${request.title ?? "Untitled"}`;

    const systemPrompt = "You are an expert AI prompt engineer. Output only the requested prompt and nothing else.";

    const [musicPrompt, artworkPrompt] = await Promise.all([
      this.client.generateText(musicPromptInput, systemPrompt),
      this.client.generateText(artworkPromptInput, systemPrompt),
    ]);

    return {
      musicPrompt: musicPrompt.trim(),
      artworkPrompt: artworkPrompt.trim(),
    };
  }
}
