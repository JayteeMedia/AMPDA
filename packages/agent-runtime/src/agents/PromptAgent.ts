import type { Job } from "@ampda/job-engine";

import { BaseAgent } from "../agent/BaseAgent.js";

export interface PromptRequest {
  title?: string;

  genre: string;

  theme: string;

  mood: string;

  lyrics: string;
}

export interface PromptResult {
  musicPrompt: string;

  artworkPrompt: string;
}

export class PromptAgent
  extends BaseAgent<
    PromptRequest,
    PromptResult
  >
{
  async execute(
    job: Job<
      PromptRequest,
      PromptResult
    >,
  ): Promise<PromptResult> {

    const {
      title,
      genre,
      theme,
      mood,
      lyrics,
    } = job.payload;

    return {
      musicPrompt:
`Create a ${genre} song.

Title:
${title ?? "Untitled"}

Mood:
${mood}

Theme:
${theme}

Lyrics:
${lyrics}`,

      artworkPrompt:
`Album artwork.

Genre:
${genre}

Theme:
${theme}

Mood:
${mood}

Title:
${title ?? "Untitled"}`,
    };
  }
}
