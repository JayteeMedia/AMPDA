import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type {
  ProjectManifest,
  WorkflowManifest,
} from "./ProjectManifest.js";

export interface ProjectExportRequest {
  outputDirectory: string;

  lyrics: string;

  musicPrompt: string;

  artworkPrompt: string;

  metadata: unknown;

  manifest: ProjectManifest;

  workflow: WorkflowManifest;
}

export class ProjectExporter {
  async export(
    request: ProjectExportRequest,
  ): Promise<void> {

    await mkdir(
      request.outputDirectory,
      {
        recursive: true,
      },
    );

    await writeFile(
      join(request.outputDirectory, "lyrics.md"),
      request.lyrics,
    );

    await writeFile(
      join(request.outputDirectory, "music-prompt.txt"),
      request.musicPrompt,
    );

    await writeFile(
      join(request.outputDirectory, "artwork-prompt.txt"),
      request.artworkPrompt,
    );

    await writeFile(
      join(request.outputDirectory, "metadata.json"),
      JSON.stringify(
        request.metadata,
        null,
        2,
      ),
    );

    await writeFile(
      join(request.outputDirectory, "project.json"),
      JSON.stringify(
        request.manifest,
        null,
        2,
      ),
    );

    await writeFile(
      join(request.outputDirectory, "workflow.json"),
      JSON.stringify(
        request.workflow,
        null,
        2,
      ),
    );
  }
}
