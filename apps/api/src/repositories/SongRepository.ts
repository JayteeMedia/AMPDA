import { eq } from "drizzle-orm";

import { db } from "../db/client.js";
import {
  songs,
  type SongStatus,
} from "../db/schema.js";

export type CreateSongInput = {
  title: string;
  genre: string;
  mood: string;
  theme: string;
};

export class SongRepository {

  async findAll() {
    return db
      .select()
      .from(songs);
  }

  async findById(id: string) {
    const result = await db
      .select()
      .from(songs)
      .where(eq(songs.id, id))
      .limit(1);

    return result[0] ?? null;
  }

  async create(
    input: CreateSongInput,
  ) {
    const now =
      new Date().toISOString();

    const song = {
      id:
        `song_${Date.now()}_` +
        Math.random()
          .toString(36)
          .slice(2, 8),

      title: input.title,
      genre: input.genre,
      mood: input.mood,
      theme: input.theme,

      status: "queued" as SongStatus,

      createdAt: now,
      updatedAt: now,
    };

    await db
      .insert(songs)
      .values(song);

    return song;
  }

  async updateStatus(
    id: string,
    status: SongStatus,
  ) {
    const updatedAt =
      new Date().toISOString();

    const result = await db
      .update(songs)
      .set({
        status,
        updatedAt,
      })
      .where(eq(songs.id, id))
      .returning();

    return result[0] ?? null;
  }
}
