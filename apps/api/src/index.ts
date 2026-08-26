import { buildServer } from "./server.js";

async function start(): Promise<void> {
  const port = Number(process.env.PORT ?? 3000);
  const host = process.env.HOST ?? "0.0.0.0";

  try {
    const app = await buildServer();

    await app.listen({
      port,
      host,
    });

    console.log(
      `AMPDA API running on http://localhost:${port}`,
    );
  } catch (error) {
    console.error(
      "Failed to start AMPDA API:",
      error,
    );

    process.exit(1);
  }
}

void start();
