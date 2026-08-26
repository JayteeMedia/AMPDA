import type { FastifyInstance } from "fastify";

import {
  SongRepository,
} from "../repositories/SongRepository.js";

import {
  SongService,
} from "../services/SongService.js";

import {
  WorkflowJobRepository,
} from "../workflows/repositories/WorkflowJobRepository.js";

import {
  WorkflowService,
} from "../workflows/services/WorkflowService.js";

type CreateSongBody = {
  title?: string;
  genre?: string;
  mood?: string;
  theme?: string;
};

type UpdateSongStatusBody = {
  status?: string;
};

export async function songRoutes(
  app: FastifyInstance,
): Promise<void> {

  const songRepository =
    new SongRepository();

  const workflowJobRepository =
    new WorkflowJobRepository();

  const workflowService =
    new WorkflowService(
      workflowJobRepository,
    );

  const service =
    new SongService(
      songRepository,
      workflowService,
    );

  app.get(
    "/songs",
    async () => {
      return service.listSongs();
    },
  );

  app.get<{ Params: { id: string } }>(
    "/songs/:id",
    async (request, reply) => {

      const song =
        await service.getSong(
          request.params.id,
        );

      if (!song) {
        return reply
          .code(404)
          .send({
            error: "Song not found",
          });
      }

      return song;
    },
  );

  app.post<{ Body: CreateSongBody }>(
    "/songs",
    async (request, reply) => {

      try {
        const song =
          await service.createSong(
            request.body,
          );

        return reply
          .code(201)
          .send(song);

      } catch (error) {

        if (
          error instanceof Error &&
          error.message ===
            "Song title is required"
        ) {
          return reply
            .code(400)
            .send({
              error: error.message,
            });
        }

        throw error;
      }
    },
  );

  app.patch<{
    Params: { id: string };
    Body: UpdateSongStatusBody;
  }>(
    "/songs/:id/status",
    async (request, reply) => {

      try {
        const status =
          request.body?.status;

        if (!status) {
          return reply
            .code(400)
            .send({
              error:
                "Song status is required",
            });
        }

        const song =
          await service.updateStatus(
            request.params.id,
            status,
          );

        if (!song) {
          return reply
            .code(404)
            .send({
              error: "Song not found",
            });
        }

        return song;

      } catch (error) {

        if (
          error instanceof Error &&
          error.name ===
            "InvalidSongTransitionError"
        ) {
          const transitionError =
            error as Error & {
              from?: string;
              to?: string;
            };

          return reply
            .code(409)
            .send({
              error:
                transitionError.message,
              from:
                transitionError.from,
              to:
                transitionError.to,
              allowedTransitions:
                transitionError.from
                  ? service.getAllowedTransitions(
                      transitionError.from,
                    )
                  : [],
            });
        }

        if (
          error instanceof Error &&
          error.message.startsWith(
            "Invalid song status:",
          )
        ) {
          return reply
            .code(400)
            .send({
              error: error.message,
            });
        }

        throw error;
      }
    },
  );
}
