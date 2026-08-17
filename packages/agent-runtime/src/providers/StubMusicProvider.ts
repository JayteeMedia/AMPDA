import type {
  MusicGenerationRequest,
  MusicGenerationResult,
  MusicProvider,
} from "./MusicProvider.js";

export class StubMusicProvider
  implements MusicProvider
{
  async generate(
    request: MusicGenerationRequest,
  ): Promise<MusicGenerationResult> {
    void request;

    return {
      trackId: crypto.randomUUID(),

      status: "queued",
    };
  }
}
