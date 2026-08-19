import type {
  SongProject,
} from "@ampda/core";

import type {
  CreateSongRequest,
} from "../workflows/CreateSongWorkflow.js";

export interface PipelineContext {

  request: CreateSongRequest;

  outputDirectory: string;

  project: SongProject;

  workflowPlan?: unknown;

  trackId?: string;

  imageId?: string;

}
