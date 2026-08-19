import type {
  SongMetadata,
} from "@ampda/core";

export interface MetadataGenerationRequest {

  title: string;

  genre: string;

  mood: string;

  theme: string;

  lyrics: string;

}

export interface MetadataGenerationResult {

  metadata: SongMetadata;

}

export interface MetadataProvider {

  generate(
    request: MetadataGenerationRequest,
  ): Promise<MetadataGenerationResult>;

}
