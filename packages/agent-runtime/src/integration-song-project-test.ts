import {
  createSongWorkflow,
  createSongWorkflowRuntime,
  getSongProject,
} from "./SongWorkflowComposition.js";

async function main(): Promise<void> {
  console.log("");
  console.log("=========================================");
  console.log("AMPDA END-TO-END SONG WORKFLOW");
  console.log("=========================================");

  const runtime =
    createSongWorkflowRuntime();

  const workflow =
    createSongWorkflow(
      runtime,
      {
        title:
          "Back Where I Started",
        genre:
          "Hip Hop",
        mood:
          "Dark",
        theme:
          "Returning to where the journey began.",
      },
    );

  runtime.engine.register(
    workflow,
  );

  if (
    !runtime.engine.has(
      workflow.name,
    )
  ) {
    throw new Error(
      "Song workflow was not registered.",
    );
  }

  const result =
    await runtime.engine.execute(
      workflow.name,
    );

  if (!result.success) {
    const failedStep =
      Object.entries(result.steps)
        .find(
          ([, step]) =>
            !step.success,
        );

    throw new Error(
      `Song workflow failed at ${
        failedStep?.[0] ?? "unknown step"
      }: ${
        failedStep?.[1].error?.message ??
        "unknown error"
      }`,
    );
  }

  const project =
    getSongProject(
      workflow,
    );

  if (
    project.title !==
    "Back Where I Started"
  ) {
    throw new Error(
      "SongProject title is incorrect.",
    );
  }

  if (
    project.genre !== "Hip Hop"
  ) {
    throw new Error(
      "SongProject genre is incorrect.",
    );
  }

  if (
    project.mood !== "Dark"
  ) {
    throw new Error(
      "SongProject mood is incorrect.",
    );
  }

  if (
    project.theme !==
    "Returning to where the journey began."
  ) {
    throw new Error(
      "SongProject theme is incorrect.",
    );
  }

  if (!project.lyrics) {
    throw new Error(
      "SongProject lyrics are missing.",
    );
  }

  if (!project.musicPrompt) {
    throw new Error(
      "SongProject musicPrompt is missing.",
    );
  }

  if (!project.artworkPrompt) {
    throw new Error(
      "SongProject artworkPrompt is missing.",
    );
  }

  if (!project.metadata) {
    throw new Error(
      "SongProject metadata is missing.",
    );
  }

  if (
    result.steps["planner"]?.success !==
    true
  ) {
    throw new Error(
      "Planner workflow step failed.",
    );
  }

  if (
    result.steps["lyrics"]?.success !==
    true
  ) {
    throw new Error(
      "Lyrics workflow step failed.",
    );
  }

  if (
    result.steps["prompts"]?.success !==
    true
  ) {
    throw new Error(
      "Prompt workflow step failed.",
    );
  }

  if (
    result.steps["music"]?.success !==
    true
  ) {
    throw new Error(
      "Music workflow step failed.",
    );
  }

  if (
    result.steps["artwork"]?.success !==
    true
  ) {
    throw new Error(
      "Artwork workflow step failed.",
    );
  }

  if (
    result.steps["metadata"]?.success !==
    true
  ) {
    throw new Error(
      "Metadata workflow step failed.",
    );
  }

  if (
    result.steps["song-project"]?.success !==
    true
  ) {
    throw new Error(
      "SongProject workflow step failed.",
    );
  }

  console.log("");
  console.log(
    "PASS: Composition root created.",
  );
  console.log(
    "PASS: Six agents registered.",
  );
  console.log(
    "PASS: Song workflow registered.",
  );
  console.log(
    "PASS: Planner step executed.",
  );
  console.log(
    "PASS: Lyrics step executed.",
  );
  console.log(
    "PASS: Prompt step executed.",
  );
  console.log(
    "PASS: Music step executed.",
  );
  console.log(
    "PASS: Artwork step executed.",
  );
  console.log(
    "PASS: Metadata step executed.",
  );
  console.log(
    "PASS: SongProject assembled.",
  );

  console.log("");
  console.log("SongProject:");
  console.log(
    `  id: ${project.id}`,
  );
  console.log(
    `  title: ${project.title}`,
  );
  console.log(
    `  genre: ${project.genre}`,
  );
  console.log(
    `  mood: ${project.mood}`,
  );
  console.log(
    `  theme: ${project.theme}`,
  );
  console.log(
    `  lyrics: ${project.lyrics.length} chars`,
  );
  console.log(
    `  musicPrompt: ${project.musicPrompt.length} chars`,
  );
  console.log(
    `  artworkPrompt: ${project.artworkPrompt.length} chars`,
  );
  console.log(
    `  metadata.version: ${project.metadata.version}`,
  );

  console.log("");
  console.log("=========================================");
  console.log("END-TO-END SONG WORKFLOW: PASS");
  console.log("=========================================");
}

main().catch((error) => {
  console.error("");
  console.error(
    "END-TO-END SONG WORKFLOW: FAIL",
  );
  console.error(error);
  process.exitCode = 1;
});


