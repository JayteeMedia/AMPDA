import { mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";

import { Command } from "commander";

import {
  AgentCompositionRoot,
  CreateSongWorkflow,
} from "@ampda/orchestrator";

export const createSongCommand =
  new Command("create-song")
    .description(
      "Generate a complete AI song project",
    )
    .requiredOption(
      "--title <title>",
      "Song title",
    )
    .requiredOption(
      "--genre <genre>",
      "Genre",
    )
    .requiredOption(
      "--theme <theme>",
      "Theme",
    )
    .requiredOption(
      "--mood <mood>",
      "Mood",
    )
    .option(
      "--output <directory>",
      "Output directory",
      "./songs",
    )
    .action(async (options) => {

      const slug =
        (options.title as string)
          .replace(/\s+/g, "_");

      const root =
        resolve(
          join(
            options.output as string,
            slug,
          ),
        );

      await mkdir(
        root,
        {
          recursive: true,
        },
      );

      console.log("");
      console.log("=========================================");
      console.log(" AMPDA — Generating Song Project");
      console.log("=========================================");
      console.log(` Title  : ${options.title}`);
      console.log(` Genre  : ${options.genre}`);
      console.log(` Mood   : ${options.mood}`);
      console.log(` Theme  : ${options.theme}`);
      console.log(` Output : ${root}`);
      console.log("=========================================");
      console.log("");

      const registry =
        AgentCompositionRoot.createRegistry();

      const workflow =
        new CreateSongWorkflow(
          registry,
        );

      const result =
        await workflow.execute({

          title:
            options.title,

          genre:
            options.genre,

          mood:
            options.mood,

          theme:
            options.theme,

          outputDirectory:
            root,

        });

      const project =
        result.project;

      console.log("");
      console.log("=========================================");
      console.log(" PROJECT CREATED");
      console.log("=========================================");
      console.log("");

      console.log(
        `Directory : ${result.outputDirectory}`,
      );

      console.log("");

      console.log("Files");

      console.log("  ✓ lyrics.md");
      console.log("  ✓ music-prompt.txt");
      console.log("  ✓ artwork-prompt.txt");
      console.log("  ✓ metadata.json");
      console.log("  ✓ project.json");
      console.log("  ✓ workflow.json");

      console.log("");

      console.log("Song");

      console.log(`  Title : ${project.title}`);
      console.log(`  Genre : ${project.genre}`);
      console.log(`  Mood  : ${project.mood}`);
      console.log(`  Theme : ${project.theme}`);

      if (project.metadata) {

        console.log("");

        console.log("Metadata");

        console.log(
          `  BPM : ${project.metadata.bpm}`,
        );

        console.log(
          `  Key : ${project.metadata.key}`,
        );

        console.log(
          `  Tags : ${project.metadata.tags.join(", ")}`,
        );

      }

      if (project.musicPrompt) {

        console.log("");

        console.log("Music Prompt");

        console.log(
          project.musicPrompt.length > 300
            ? project.musicPrompt.substring(0, 300) + "..."
            : project.musicPrompt,
        );

      }

      if (project.lyrics) {

        console.log("");

        console.log("Lyrics");

        console.log(
          project.lyrics,
        );

      }

      console.log("");

      console.log("Done.");

    });
