import { Command } from "commander";

import {
  createSongCommand,
} from "./commands/create-song.js";

const program = new Command();

program
  .name("ampda")
  .description(
    "Autonomous Music Production & Distribution Agent",
  )
  .version("0.1.0");

program.addCommand(
  createSongCommand,
);

program.parse();
