export interface MetadataGenerationRequest {
  title: string;

  genre: string;

  mood: string;

  theme: string;

  lyrics: string;
}

export interface SongMetadata {
  title: string;
  genre: string;
  mood: string;
  theme: string;
  description: string;
  tags: string[];
  bpm: number;
  key: string;
  version: string;
}

export interface MetadataGenerationResult {
  metadata: SongMetadata;
}

export interface MetadataProvider {
  generate(
    request: MetadataGenerationRequest,
  ): Promise<MetadataGenerationResult>;
}
