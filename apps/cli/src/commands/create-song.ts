import { mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";

import { Command } from "commander";

import { CreateSongWorkflow } from "@ampda/orchestrator";

export const createSongCommand =
  new Command("create-song")
    .description(
      "Generate a complete AI song project using local LLM (Ollama)",
    )
    .requiredOption("--title <title>", "Song title")
    .requiredOption("--genre <genre>", "Genre")
    .requiredOption("--theme <theme>", "Theme")
    .requiredOption("--mood <mood>", "Mood")
    .option("--output <directory>", "Output directory", "./songs")
    .action(async (options) => {
      const slug = (options.title as string).replace(/\s+/g, "_");
      const root = resolve(join(options.output as string, slug));

      await mkdir(root, { recursive: true });

      console.log("");
      console.log("=========================================");
      console.log(" AMPDA — Generating Song Project");
      console.log("=========================================");
      console.log(` Title  : ${options.title as string}`);
      console.log(` Genre  : ${options.genre as string}`);
      console.log(` Mood   : ${options.mood as string}`);
      console.log(` Theme  : ${options.theme as string}`);
      console.log(` Output : ${root}`);
      console.log("=========================================");
      console.log("");

      const workflow = new CreateSongWorkflow();

      const result = await workflow.execute({
        title: options.title as string,
        genre: options.genre as string,
        mood: options.mood as string,
        theme: options.theme as string,
        outputDirectory: root,
      });

      console.log("");
      console.log("=========================================");
      console.log(" PROJECT CREATED");
      console.log("=========================================");
      console.log("");
      console.log(`Directory : ${result.projectDirectory}`);
      console.log("");
      console.log("Files written:");
      console.log(`  lyrics.md`);
      console.log(`  music-prompt.txt`);
      console.log(`  artwork-prompt.txt`);
      console.log(`  metadata.json`);
      console.log(`  project.json`);
      console.log(`  workflow.json`);
      console.log("");
      console.log("--- LYRICS ---");
      console.log("");
      console.log(result.lyrics);
      console.log("");
      console.log("--- METADATA ---");
      console.log("");
      console.log(`  BPM         : ${result.metadata.bpm}`);
      console.log(`  Key         : ${result.metadata.key}`);
      console.log(`  Genre       : ${result.metadata.genre}`);
      console.log(`  Description : ${result.metadata.description}`);
      console.log(`  Tags        : ${result.metadata.tags.join(", ")}`);
      console.log("");
      console.log("--- MUSIC PROMPT (preview) ---");
      console.log("");
      console.log(result.musicPrompt.substring(0, 300) + (result.musicPrompt.length > 300 ? "..." : ""));
      console.log("");
    });
