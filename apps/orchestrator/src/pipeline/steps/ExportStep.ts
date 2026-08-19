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

    await this.exporter.export({

      outputDirectory:
        context.outputDirectory,

      lyrics:
        context.lyrics ?? "",

      musicPrompt:
        context.musicPrompt ?? "",

      artworkPrompt:
        context.artworkPrompt ?? "",

      metadata:
        context.metadata ?? {},

      manifest: {
        id: crypto.randomUUID(),

        title:
          context.request.title,

        createdAt:
          new Date().toISOString(),

        genre:
          context.request.genre,

        mood:
          context.request.mood,

        theme:
          context.request.theme,

        files: {
          lyrics: "lyrics.md",
          musicPrompt: "music-prompt.txt",
          artworkPrompt: "artwork-prompt.txt",
          metadata: "metadata.json",
          workflow: "workflow.json",
        },
      },

      workflow: {
        version: "1.0",

        generatedAt:
          new Date().toISOString(),

        status: "completed",

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
            context.request.title,

          genre:
            context.request.genre,

          mood:
            context.request.mood,

          theme:
            context.request.theme,
        },
      },

    });

  }

}
