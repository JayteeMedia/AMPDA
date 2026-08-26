import { eq } from "drizzle-orm";

import { db } from "../../db/client.js";

import {
  songPlans,
} from "../../db/schema.js";

import type {
  SongPlanningResult,
} from "../agents/SongPlanningAgent.js";

export type CreateSongPlanInput = {
  songId: string;
  result: SongPlanningResult;
};

export class SongPlanRepository {

  async create(
    input: CreateSongPlanInput,
  ) {
    const now =
      new Date().toISOString();

    const id =
      `plan_${Date.now()}_` +
      Math.random()
        .toString(36)
        .slice(2, 8);

    const plan = {
      id,

      songId:
        input.songId,

      concept:
        input.result.concept,

      structure:
        JSON.stringify(
          input.result.structure,
        ),

      bpm:
        input.result.bpm,

      key:
        input.result.key,

      energy:
        input.result.energy,

      vocalStyle:
        input.result.vocalStyle,

      productionDirection:
        input.result.productionDirection,

      createdAt:
        now,

      updatedAt:
        now,
    };

    await db
      .insert(songPlans)
      .values(plan);

    return plan;
  }

  async findBySongId(
    songId: string,
  ) {
    const result =
      await db
        .select()
        .from(songPlans)
        .where(
          eq(
            songPlans.songId,
            songId,
          ),
        )
        .limit(1);

    const row =
      result[0];

    if (!row) {
      return null;
    }

    return {
      ...row,

      structure:
        JSON.parse(
          row.structure,
        ) as string[],
    };
  }
}
