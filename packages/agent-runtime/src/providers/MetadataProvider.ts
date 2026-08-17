export interface MetadataGenerationRequest {
  title: string;

  genre: string;

  mood: string;

  theme: string;

  lyrics: string;
}

export interface MetadataGenerationResult {
  metadata: {
    title: string;
    genre: string;
    mood: string;
    theme: string;
    tags: string[];
    description: string;
  };
}

export interface MetadataProvider {
  generate(
    request: MetadataGenerationRequest,
  ): Promise<MetadataGenerationResult>;
}
