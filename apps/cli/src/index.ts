import { Command } from "commander";

const program = new Command();

program
  .name("ampda")
  .description("AMPDA Command Line Interface")
  .version("0.1.0");

program.parse();
