import type {
  PromptProvider,
  PromptGenerationRequest,
  PromptGenerationResult,
} from "@ampda/agent-runtime";
import { OpenAIClient } from "./OpenAIClient.js";

export class OpenAIPromptProvider implements PromptProvider {
  private readonly client: OpenAIClient;

  constructor(client?: OpenAIClient) {
    this.client = client ?? new OpenAIClient();
  }

  async generate(
    request: PromptGenerationRequest,
  ): Promise<PromptGenerationResult> {
    const [musicPrompt, artworkPrompt] = await Promise.all([
      this.generateMusicPrompt(request),
      this.generateArtworkPrompt(request),
    ]);

    return { musicPrompt, artworkPrompt };
  }

  private async generateMusicPrompt(
    request: PromptGenerationRequest,
  ): Promise<string> {
    const systemPrompt = `You are an expert AI music production prompt engineer. \
Your prompts are used as direct input to AI music generation systems like Suno, Udio, or similar. \
Output only the production-ready prompt — no preamble, no explanation.`;

    const userPrompt = `Generate a detailed, production-ready music generation prompt for the following song:

Title: ${request.title ?? "Untitled"}
Genre: ${request.genre}
Mood: ${request.mood}
Theme: ${request.theme}

The prompt MUST include all of the following production parameters, clearly labelled:
- BPM (a specific number appropriate to the genre and mood)
- Key (key and mode, e.g. "A minor", "D major")
- Genre (specific sub-genre if applicable)
- Instrumentation (list main instruments)
- Drum style (describe the drum pattern and energy)
- Bass style (describe bass character and role)
- Arrangement (how the song builds and evolves section by section)
- Energy (overall energy arc from start to finish)
- Mix direction (clarity, warmth, brightness, space — be specific)
- Vocal style (delivery style, tone, harmonies if any)

Write as a single cohesive prompt paragraph after the labelled parameters.`;

    return (await this.client.generateText(userPrompt, systemPrompt)).trim();
  }

  private async generateArtworkPrompt(
    request: PromptGenerationRequest,
  ): Promise<string> {
    const systemPrompt = `You are an expert AI image generation prompt engineer specialising in album artwork. \
Your prompts are used as direct input to image generation systems like Midjourney, DALL-E, or Stable Diffusion. \
Output only the production-ready prompt — no preamble, no explanation.`;

    const userPrompt = `Generate a detailed, cinematic album cover artwork prompt for the following song:

Title: ${request.title ?? "Untitled"}
Genre: ${request.genre}
Mood: ${request.mood}
Theme: ${request.theme}

The prompt MUST describe all of the following elements, integrated into a single cohesive description:
- Subject (the central visual subject or character)
- Composition (how the image is framed — rule of thirds, centred, negative space, etc.)
- Lighting (quality, direction, colour temperature, drama)
- Mood (how the visual atmosphere mirrors the song's emotional tone)
- Environment (setting — indoor, outdoor, abstract, urban, natural)
- Camera style (wide angle, portrait, macro, film grain, etc.)
- Typography guidance (where the title text would sit, style hints — bold, minimal, hand-lettered, etc.)
- Art direction (photography vs illustration vs 3D render, colour palette, era or aesthetic reference)

Write as a single cohesive paragraph suitable for direct use in an image generation system.`;

    return (await this.client.generateText(userPrompt, systemPrompt)).trim();
  }
}
