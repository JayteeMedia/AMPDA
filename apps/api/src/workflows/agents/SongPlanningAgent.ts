import type { InferSelectModel } from "drizzle-orm";

import { songs } from "../../db/schema.js";

export type Song =
  InferSelectModel<typeof songs>;

export type SongPlanningResult = {
  title: string;
  genre: string;
  mood: string;
  theme: string;

  concept: string;

  structure: string[];

  bpm: number;

  key: string;

  energy: number;

  vocalStyle: string;

  productionDirection: string;
};

export class SongPlanningAgent {

  async plan(
    song: Song,
  ): Promise<SongPlanningResult> {

    return {
      title:
        song.title,

      genre:
        song.genre,

      mood:
        song.mood,

      theme:
        song.theme,

      concept:
        `Develop the song "${song.title}" around the theme "${song.theme}" with a ${song.mood} emotional direction.`,

      structure: [
        "intro",
        "verse_1",
        "hook",
        "verse_2",
        "hook",
        "bridge",
        "final_hook",
        "outro",
      ],

      bpm:
        140,

      key:
        "F# minor",

      energy:
        7,

      vocalStyle:
        "Confident contemporary rap vocal with controlled melodic phrasing.",

      productionDirection:
        "Modern hip-hop production with heavy drums, controlled sub bass, atmospheric layers, and clear vocal space.",
    };
  }
}
