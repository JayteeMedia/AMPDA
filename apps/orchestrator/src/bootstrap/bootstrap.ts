import { runtime } from "../runtime/Runtime.js";

export async function bootstrap(): Promise<void> {
  console.log("");
  console.log("=========================================");
  console.log(" AMPDA Runtime v0.1.0");
  console.log("=========================================");
  console.log("");

  await runtime.start();

  async function shutdown(): Promise<void> {
    console.log("");

    await runtime.stop();

    process.exit(0);
  }

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}
