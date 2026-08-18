import type {
  LyricsGenerationRequest,
  LyricsGenerationResult,
  LyricsProvider,
} from "./LyricsProvider.js";

export class StubLyricsProvider implements LyricsProvider {
  async generate(
    request: LyricsGenerationRequest,
  ): Promise<LyricsGenerationResult> {
    return {
      lyrics: `TITLE: ${request.title ?? "Untitled"}\n\nGENRE: ${request.genre}\n\nTHEME: ${request.theme}\n\nMOOD: ${request.mood}\n\n[Placeholder Lyrics]\n`,
    };
  }
}
