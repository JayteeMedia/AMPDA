import type {
  Song,
} from "./SongPlanningAgent.js";

export type SongWritingPlan = {
  concept: string;
  structure: string[];
  bpm: number;
  key: string;
  energy: number;
  vocalStyle: string;
  productionDirection: string;
};

export type SongWritingResult = {
  lyrics: string;
  structure: string[];
  vocalDirection: string;
  writingNotes: string;
};

export class SongWritingAgent {

  async write(
    song: Song,
    plan: SongWritingPlan,
  ): Promise<SongWritingResult> {

    const structure =
      plan.structure;

    const lyrics = [
      `[TITLE: ${song.title}]`,
      "",
      `[VERSE 1]`,
      `Built from the ground where the pressure got heavy,`,
      `Kept moving forward when the road wasn't ready.`,
      `${song.theme} became more than a phrase,`,
      `Turned every setback into permanent days.`,
      "",
      `[HOOK]`,
      `${song.title}, this is something permanent,`,
      `Built from the pressure, every scar evident.`,
      `No temporary vision, no borrowed identity,`,
      `Every step forward becomes part of the legacy.`,
      "",
      `[VERSE 2]`,
      `I don't need permission for the work I'm creating,`,
      `Long-term vision while the whole world is waiting.`,
      `Every decision got a reason behind it,`,
      `Built the foundation then I put the weight on it.`,
      "",
      `[BRIDGE]`,
      `Still building, still focused,`,
      `Every chapter gets noticed.`,
      `What started as an idea`,
      `Turns into something that lasts.`,
      "",
      `[FINAL HOOK]`,
      `${song.title}, this is something permanent,`,
      `Built from the pressure, every scar evident.`,
      `No temporary vision, no borrowed identity,`,
      `Every step forward becomes part of the legacy.`,
    ].join("\n");

    return {
      lyrics,

      structure,

      vocalDirection:
        `${plan.vocalStyle} Deliver the verses with controlled confidence and increase melodic emphasis during the hooks.`,

      writingNotes:
        `Written around the song theme "${song.theme}" with a ${song.mood} emotional direction. Structure follows the approved planning architecture.`,
    };
  }
}
