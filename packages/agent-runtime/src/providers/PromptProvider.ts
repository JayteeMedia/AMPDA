export interface PromptGenerationRequest {
  title?: string;
  genre: string;
  theme: string;
  mood: string;
  lyrics: string;
}

export interface PromptGenerationResult {
  musicPrompt: string;
  artworkPrompt: string;
}

export interface PromptProvider {
  generate(request: PromptGenerationRequest): Promise<PromptGenerationResult>;
}
