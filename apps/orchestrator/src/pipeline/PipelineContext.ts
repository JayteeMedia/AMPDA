import type { CreateSongRequest } from "../workflows/CreateSongWorkflow.js";

export interface PipelineContext {
  request: CreateSongRequest;

  outputDirectory: string;

  lyrics?: string;

  musicPrompt?: string;

  artworkPrompt?: string;

  metadata?: unknown;

  trackId?: string;

  imageId?: string;
}
