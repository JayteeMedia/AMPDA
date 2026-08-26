import Fastify from "fastify";
import cors from "@fastify/cors";

import { healthRoutes } from "./routes/health.js";
import { runtimeRoutes } from "./routes/runtime.js";
import { songRoutes } from "./routes/songs.js";

export async function buildServer() {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: true,
  });

  await app.register(healthRoutes, {
    prefix: "/api",
  });

  await app.register(runtimeRoutes, {
    prefix: "/api",
  });

  await app.register(songRoutes, {
    prefix: "/api",
  });

  return app;
}
