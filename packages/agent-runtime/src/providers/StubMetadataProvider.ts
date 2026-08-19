import type {
  MetadataGenerationRequest,
  MetadataGenerationResult,
  MetadataProvider,
} from "./MetadataProvider.js";

export class StubMetadataProvider
  implements MetadataProvider
{
  async generate(
    request: MetadataGenerationRequest,
  ): Promise<MetadataGenerationResult> {
    return {
      metadata: {
        title: request.title,
        genre: request.genre,
        mood: request.mood,
        theme: request.theme,
        tags: [request.genre, request.theme, request.mood],
        description: `${request.genre} track about ${request.theme}.`,
        bpm: 120,
        key: "C minor",
        version: "1.0",
      },
    };
  }
}
