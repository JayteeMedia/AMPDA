import type {
  MetadataProvider,
  MetadataGenerationRequest,
  MetadataGenerationResult,
  SongMetadata,
} from "@ampda/agent-runtime";
import { OpenAIClient } from "./OpenAIClient.js";

export class OpenAIMetadataProvider implements MetadataProvider {
  private readonly client: OpenAIClient;

  constructor(client?: OpenAIClient) {
    this.client = client ?? new OpenAIClient();
  }

  async generate(
    request: MetadataGenerationRequest,
  ): Promise<MetadataGenerationResult> {
    const systemPrompt = `You are a music metadata specialist for a digital distribution platform. \
Your job is to produce accurate, search-optimised, platform-ready metadata for songs. \
Always respond with valid JSON only. No prose, no markdown fences, no explanation.`;

    const userPrompt = `Generate complete metadata for the following song:

Title: ${request.title}
Genre: ${request.genre}
Mood: ${request.mood}
Theme: ${request.theme}

Respond with a single valid JSON object matching this exact schema:
{
  "title": string,
  "genre": string,
  "mood": string,
  "theme": string,
  "description": string (2-3 sentence description of the song for streaming platforms),
  "tags": string[] (8-12 relevant tags for discoverability — genre, mood, instruments, themes),
  "bpm": number (integer, realistic BPM for the genre),
  "key": string (e.g. "A minor", "D major"),
  "version": "1.0"
}

Return only the JSON object. No preamble. No markdown.`;

    const raw = await this.client.generateText(userPrompt, systemPrompt);
    const metadata = this.parseMetadata(raw, request);

    return { metadata };
  }

  private parseMetadata(
    raw: string,
    request: MetadataGenerationRequest,
  ): SongMetadata {
    // Strip markdown code fences if the model wraps with them
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned) as Record<string, unknown>;
    } catch {
      // If JSON parsing fails, fall back to structured defaults derived from request
      throw new Error(
        `[OpenAIMetadataProvider] Failed to parse metadata JSON. Raw response: ${raw.substring(0, 200)}`,
      );
    }

    return {
      title: String(parsed["title"] ?? request.title),
      genre: String(parsed["genre"] ?? request.genre),
      mood: String(parsed["mood"] ?? request.mood),
      theme: String(parsed["theme"] ?? request.theme),
      description: String(parsed["description"] ?? ""),
      tags: Array.isArray(parsed["tags"])
        ? (parsed["tags"] as unknown[]).map(String)
        : [request.genre, request.mood, request.theme],
      bpm: typeof parsed["bpm"] === "number" ? parsed["bpm"] : 120,
      key: String(parsed["key"] ?? "C minor"),
      version: String(parsed["version"] ?? "1.0"),
    };
  }
}
