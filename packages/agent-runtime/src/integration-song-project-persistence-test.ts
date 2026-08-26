import {
  loadSongProject,
  saveSongProject,
} from "@ampda/core";

import {
  createSongWorkflow,
  createSongWorkflowRuntime,
  getSongProject,
} from "./SongWorkflowComposition.js";

import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";

async function main(): Promise<void> {
  const runtime =
    createSongWorkflowRuntime();

  const workflow =
    createSongWorkflow(
      runtime,
      {
        title:
          "Persistence Smoke Test",
        genre:
          "Hip Hop",
        mood:
          "Dark",
        theme:
          "A project that survives the process.",
      },
    );

  runtime.engine.register(
    workflow,
  );

  const result =
    await runtime.engine.execute(
      workflow.name,
    );

  if (!result.success) {
    throw new Error(
      "Song workflow failed during persistence test.",
    );
  }

  const original =
    getSongProject(workflow);

  const directory =
    join(
      tmpdir(),
      `ampda-${randomUUID()}`,
    );

  const filePath =
    join(
      directory,
      "song-project.json",
    );

  try {
    await saveSongProject(
      original,
      filePath,
    );

    const loaded =
      await loadSongProject(
        filePath,
      );

    const originalJson =
      JSON.stringify(original);

    const loadedJson =
      JSON.stringify(loaded);

    if (
      originalJson !==
      loadedJson
    ) {
      throw new Error(
        "Loaded SongProject does not match the saved SongProject.",
      );
    }

    console.log(
      "=========================================",
    );

    console.log(
      "SONG PROJECT PERSISTENCE: PASS",
    );

    console.log(
      "=========================================",
    );

    console.log(
      `file: ${filePath}`,
    );

    console.log(
      `title: ${loaded.title}`,
    );

    console.log(
      `id: ${loaded.id}`,
    );
  }
  finally {
    await fs.rm(
      directory,
      {
        recursive: true,
        force: true,
      },
    );
  }
}

main().catch(
  (error: unknown) => {
    console.error(
      error instanceof Error
        ? error
        : String(error),
    );

    process.exitCode = 1;
  },
);


