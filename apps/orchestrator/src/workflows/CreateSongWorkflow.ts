import type {
  SongProject,
} from "@ampda/core";

import {
  AgentRegistry,
} from "@ampda/agent-runtime";

import type {
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

  project: SongProject;

}

export class CreateSongWorkflow {

  private readonly pipeline: PipelineExecutor;

  constructor(
    private readonly registry: AgentRegistry,
  ) {

    this.pipeline =
      new PipelineExecutor([

        new PlannerStep(
          registry,
        ),

        new LyricsStep(
          registry,
        ),

        new PromptStep(
          registry,
        ),

        new MetadataStep(
          registry,
        ),

        new MusicStep(
          registry,
        ),

        new ArtworkStep(
          registry,
        ),

        new ExportStep(
          registry,
        ),

      ]);

  }

  async execute(
    request: CreateSongRequest,
  ): Promise<CreateSongResult> {

    const project: SongProject = {

      id: crypto.randomUUID(),

      createdAt: new Date(),

      updatedAt: new Date(),

      title: request.title,

      genre: request.genre,

      mood: request.mood,

      theme: request.theme,

    };

    const context: PipelineContext = {

      request,

      outputDirectory:
        request.outputDirectory,

      project,

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

      project:
        context.project,

    };

  }

}
