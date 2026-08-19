import type {
  PromptProvider,
  PromptGenerationRequest,
  PromptGenerationResult,
} from "@ampda/agent-runtime";

import { OpenAIClient } from "./OpenAIClient.js";

export class OpenAIPromptProvider
  implements PromptProvider
{
  private readonly client: OpenAIClient;

  constructor(
    client?: OpenAIClient,
  ) {

    this.client =
      client ??
      new OpenAIClient();

  }

  async generate(
    request: PromptGenerationRequest,
  ): Promise<PromptGenerationResult> {

    const [
      musicPrompt,
      artworkPrompt,
    ] = await Promise.all([

      this.generateMusicPrompt(
        request,
      ),

      this.generateArtworkPrompt(
        request,
      ),

    ]);

    return {

      musicPrompt,

      artworkPrompt,

    };

  }

  private async generateMusicPrompt(
    request: PromptGenerationRequest,
  ): Promise<string> {

    const systemPrompt = `
You are an expert AI music production prompt engineer.

Your prompts are used as direct input to AI music generation systems such as Suno and Udio.

Return only the final production-ready prompt.

Do not include explanations.
`.trim();

    const userPrompt = `
Generate a detailed production-ready music generation prompt.

Title:
${request.title ?? "Untitled"}

Genre:
${request.genre}

Mood:
${request.mood}

Theme:
${request.theme}

The prompt must include:

- BPM
- Key
- Genre
- Instrumentation
- Drum Style
- Bass Style
- Arrangement
- Energy
- Mix Direction
- Vocal Style

Return one cohesive prompt.
`.trim();

    return (
      await this.client.generateChat([
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ])
    ).trim();

  }

  private async generateArtworkPrompt(
    request: PromptGenerationRequest,
  ): Promise<string> {

    const systemPrompt = `
You are an expert AI artwork prompt engineer.

Generate prompts suitable for Midjourney, DALL-E and Stable Diffusion.

Return only the final prompt.

Do not include explanations.
`.trim();

    const userPrompt = `
Generate a cinematic album artwork prompt.

Title:
${request.title ?? "Untitled"}

Genre:
${request.genre}

Mood:
${request.mood}

Theme:
${request.theme}

Include:

- Subject
- Composition
- Lighting
- Environment
- Camera
- Mood
- Typography
- Art Direction

Return one cohesive prompt.
`.trim();

    return (
      await this.client.generateChat([
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ])
    ).trim();

  }

}
