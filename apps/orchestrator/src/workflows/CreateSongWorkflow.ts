import { AgentRegistry } from "@ampda/agent-runtime";

import {
  PipelineContext,
} from "../pipeline/PipelineContext.js";

import {
  PipelineExecutor,
} from "../pipeline/PipelineExecutor.js";

import {
  PlannerStep,
} from "../pipeline/steps/PlannerStep.js";

import {
  LyricsStep,
} from "../pipeline/steps/LyricsStep.js";

import {
  PromptStep,
} from "../pipeline/steps/PromptStep.js";

import {
  MetadataStep,
} from "../pipeline/steps/MetadataStep.js";

import {
  MusicStep,
} from "../pipeline/steps/MusicStep.js";

import {
  ArtworkStep,
} from "../pipeline/steps/ArtworkStep.js";

import {
  ExportStep,
} from "../pipeline/steps/ExportStep.js";

export interface CreateSongRequest {

  title: string;

  genre: string;

  mood: string;

  theme: string;

  outputDirectory: string;

}

export interface CreateSongResult {

  success: boolean;

  outputDirectory: string;

}

export class CreateSongWorkflow {

  private readonly pipeline: PipelineExecutor;

  constructor(
    private readonly registry: AgentRegistry,
  ) {

    this.pipeline =
      new PipelineExecutor([

        new PlannerStep(
          this.registry,
        ),

        new LyricsStep(
          this.registry,
        ),

        new PromptStep(
          this.registry,
        ),

        new MetadataStep(
          this.registry,
        ),

        new MusicStep(
          this.registry,
        ),

        new ArtworkStep(
          this.registry,
        ),

        new ExportStep(
          this.registry,
        ),

      ]);

  }

  async execute(
    request: CreateSongRequest,
  ): Promise<CreateSongResult> {

    const context: PipelineContext = {

      request,

      outputDirectory:
        request.outputDirectory,

    };

    const result =
      await this.pipeline.execute(
        context,
      );

    if (!result.success) {

      throw result.error;

    }

    return {

      success: true,

      outputDirectory:
        context.outputDirectory,

    };

  }

}
