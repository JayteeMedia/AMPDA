export interface LyricsGenerationRequest {
  title?: string;
  genre: string;
  theme: string;
  mood: string;
}

export interface LyricsGenerationResult {
  lyrics: string;
}

export interface LyricsProvider {
  generate(request: LyricsGenerationRequest): Promise<LyricsGenerationResult>;
}
