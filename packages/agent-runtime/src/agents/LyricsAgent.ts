import type { Job } from "@ampda/job-engine";

import { BaseAgent } from "../agent/BaseAgent.js";

export interface LyricsRequest {
  title?: string;

  genre: string;

  theme: string;

  mood: string;
}

export interface LyricsResult {
  lyrics: string;
}

export class LyricsAgent
  extends BaseAgent<
    LyricsRequest,
    LyricsResult
  >
{
  async execute(
    job: Job<
      LyricsRequest,
      LyricsResult
    >,
  ): Promise<LyricsResult> {
    const {
      title,
      genre,
      theme,
      mood,
    } = job.payload;

    // TODO:
    // Replace with configured LLM provider.
    // (OpenAI, Ollama, etc.)

    return {
      lyrics:
`TITLE: ${title ?? "Untitled"}

GENRE: ${genre}

THEME: ${theme}

MOOD: ${mood}

[Placeholder Lyrics]
`,
    };
  }
}
