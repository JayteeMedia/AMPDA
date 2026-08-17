import type {
  ArtworkGenerationRequest,
  ArtworkGenerationResult,
  ArtworkProvider,
} from "./ArtworkProvider.js";

export class StubArtworkProvider
  implements ArtworkProvider
{
  async generate(
    request: ArtworkGenerationRequest,
  ): Promise<ArtworkGenerationResult> {
    void request;

    return {
      imageId: crypto.randomUUID(),

      status: "queued",
    };
  }
}
