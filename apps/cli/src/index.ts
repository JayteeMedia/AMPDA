#!/usr/bin/env node

import { Command } from "commander";
import { runNewCommand } from "./commands/new.js";

const program = new Command();

program
  .name("ampda")
  .description("AMPDA Developer CLI")
  .version("0.1.0");

program
  .command("new")
  .description("Generate a new AMPDA resource")
  .argument("<type>", "Resource type (package, agent, plugin, service)")
  .argument("<name>", "Resource name")
  .action(async (type: string, name: string) => {
    await runNewCommand({
      type,
      name,
    });
  });

program.parse();
