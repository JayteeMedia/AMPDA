import type { FastifyInstance } from "fastify";

export async function healthRoutes(
  app: FastifyInstance,
): Promise<void> {
  app.get(
    "/health",
    async () => ({
      status: "ok",
      service: "ampda-api",
      timestamp: new Date().toISOString(),
    }),
  );
}
