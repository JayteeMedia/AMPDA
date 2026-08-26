import type { FastifyInstance } from "fastify";

export async function runtimeRoutes(
  app: FastifyInstance,
): Promise<void> {
  app.get(
    "/runtime",
    async () => ({
      version: "0.1.0",
      service: "ampda-api",
      status: "running",
      uptime: process.uptime(),
    }),
  );
}
