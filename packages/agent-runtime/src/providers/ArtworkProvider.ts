export interface ArtworkGenerationRequest {
  prompt: string;
}

export interface ArtworkGenerationResult {
  imageId: string;

  status: "queued" | "completed";

  imageUrl?: string;
}

export interface ArtworkProvider {
  generate(
    request: ArtworkGenerationRequest,
  ): Promise<ArtworkGenerationResult>;
}
