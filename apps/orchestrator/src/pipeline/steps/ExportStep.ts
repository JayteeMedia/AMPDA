import { ProjectExporter } from "@ampda/project-export";

import { AgentPipelineStep } from "../AgentPipelineStep.js";

import type { PipelineContext } from "../PipelineContext.js";
import type { PipelineStep } from "../PipelineStep.js";

export class ExportStep
  extends AgentPipelineStep
  implements PipelineStep
{
  readonly name = "Export";

  private readonly exporter =
    new ProjectExporter();

  async execute(
    context: PipelineContext,
  ): Promise<void> {

    const project =
      context.project;

    project.updatedAt =
      new Date();

    await this.exporter.export({

      outputDirectory:
        context.outputDirectory,

      lyrics:
        project.lyrics ?? "",

      musicPrompt:
        project.musicPrompt ?? "",

      artworkPrompt:
        project.artworkPrompt ?? "",

      metadata:
        project.metadata ?? {},

      manifest: {

        id:
          project.id,

        title:
          project.title,

        createdAt:
          project.createdAt.toISOString(),

        genre:
          project.genre,

        mood:
          project.mood,

        theme:
          project.theme,

        files: {

          lyrics:
            "lyrics.md",

          musicPrompt:
            "music-prompt.txt",

          artworkPrompt:
            "artwork-prompt.txt",

          metadata:
            "metadata.json",

          workflow:
            "workflow.json",

        },

      },

      workflow: {

        version:
          "1.0",

        generatedAt:
          new Date().toISOString(),

        status:
          "completed",

        steps: [
          "Planner",
          "Lyrics",
          "Prompt",
          "Metadata",
          "Music",
          "Artwork",
          "Export",
        ],

        request: {

          title:
            project.title,

          genre:
            project.genre,

          mood:
            project.mood,

          theme:
            project.theme,

        },

      },

    });

  }

}
