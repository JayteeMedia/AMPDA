#!/usr/bin/env node

import { bootstrap } from "./bootstrap/bootstrap.js";

async function main(): Promise<void> {
  try {
    await bootstrap();
  } catch (error) {
    console.error("[AMPDA] Fatal startup error");
    console.error(error);
    process.exit(1);
  }
}

void main();
