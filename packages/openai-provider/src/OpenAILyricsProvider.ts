import type {
  LyricsProvider,
  LyricsGenerationRequest,
  LyricsGenerationResult,
} from "@ampda/agent-runtime";
import { OpenAIClient } from "./OpenAIClient.js";

export class OpenAILyricsProvider implements LyricsProvider {
  private readonly client: OpenAIClient;

  constructor(client?: OpenAIClient) {
    this.client = client ?? new OpenAIClient();
  }

  async generate(
    request: LyricsGenerationRequest,
  ): Promise<LyricsGenerationResult> {
    const systemPrompt = `You are a professional songwriter with expertise across all genres. \
Write complete, emotionally resonant, commercially-ready song lyrics. \
Produce only the song lyrics with section headers — no commentary, no explanation, no filler.`;

    const userPrompt = `Write complete song lyrics for the following song:

Title: ${request.title ?? "Untitled"}
Genre: ${request.genre}
Mood: ${request.mood}
Theme: ${request.theme}

Structure your output with these labelled sections in order:
[Intro]
[Verse 1]
[Hook]
[Verse 2]
[Bridge]
[Final Hook]
[Outro]

Requirements:
- Each section must be fully written out — no placeholders, no brackets inside the lyrics.
- The mood must be felt throughout the language and imagery.
- Rhyme scheme should be consistent and natural to the genre.
- The hook must be memorable and repeat the core emotional message.
- The bridge should shift perspective or energy before returning to the final hook.
- Write as a human songwriter, not as an AI.`;

    const lyrics = await this.client.generateText(userPrompt, systemPrompt);

    return {
      lyrics: lyrics.trim(),
    };
  }
}
