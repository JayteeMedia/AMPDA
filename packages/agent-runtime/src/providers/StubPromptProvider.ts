import type {
  PromptGenerationRequest,
  PromptGenerationResult,
  PromptProvider,
} from "./PromptProvider.js";

export class StubPromptProvider implements PromptProvider {
  async generate(
    request: PromptGenerationRequest,
  ): Promise<PromptGenerationResult> {
    return {
      musicPrompt: `Create a ${request.genre} song.\n\nTitle:\n${request.title ?? "Untitled"}\n\nMood:\n${request.mood}\n\nTheme:\n${request.theme}\n\nLyrics:\n${request.lyrics}`,
      artworkPrompt: `Album artwork.\n\nGenre:\n${request.genre}\n\nTheme:\n${request.theme}\n\nMood:\n${request.mood}\n\nTitle:\n${request.title ?? "Untitled"}`,
    };
  }
}
