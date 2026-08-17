import { mkdir } from "node:fs/promises";
import { join } from "node:path";

import { Command } from "commander";

import {
  CreateSongWorkflow,
} from "@ampda/orchestrator";

export const createSongCommand =
  new Command("create-song")
    .description(
      "Generate a complete AMPDA song project",
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
    .action(
      async (options) => {

        const root =
          join(
            options.output,
            options.title
              .replace(/\s+/g, "_"),
          );

        await mkdir(
          root,
          {
            recursive: true,
          },
        );

        const workflow =
          new CreateSongWorkflow();

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

        console.log("");

        console.log(
          "====================================",
        );

        console.log(
          "AMPDA PROJECT CREATED",
        );

        console.log(
          "====================================",
        );

        console.log("");

        console.log(
          `Project : ${result.projectDirectory}`,
        );

        console.log("");

        console.log(
          "Lyrics",
        );

        console.log(
          result.lyrics,
        );

        console.log("");

      },
    );
