export interface MusicGenerationRequest {
  prompt: string;
}

export interface MusicGenerationResult {
  trackId: string;

  status: "queued" | "completed";

  audioUrl?: string;
}

export interface MusicProvider {
  generate(
    request: MusicGenerationRequest,
  ): Promise<MusicGenerationResult>;
}
