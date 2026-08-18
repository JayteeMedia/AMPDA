import type { LyricsProvider, LyricsGenerationRequest, LyricsGenerationResult } from "@ampda/agent-runtime";
import { OpenAIClient } from "./OpenAIClient.js";

export class OpenAILyricsProvider implements LyricsProvider {
  private client: OpenAIClient;

  constructor(client?: OpenAIClient) {
    this.client = client || new OpenAIClient();
  }

  async generate(request: LyricsGenerationRequest): Promise<LyricsGenerationResult> {
    const prompt = `Write lyrics for a ${request.genre} song.
Title: ${request.title ?? "Untitled"}
Theme: ${request.theme}
Mood: ${request.mood}`;

    const systemPrompt = "You are a professional songwriter. Output only the lyrics, without any commentary or conversational filler.";
    
    const lyrics = await this.client.generateText(prompt, systemPrompt);

    return {
      lyrics: lyrics.trim(),
    };
  }
}
