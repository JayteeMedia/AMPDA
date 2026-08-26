import type { SongRepository } from "../../repositories/SongRepository.js";
import type { SongPlanRepository } from "../repositories/SongPlanRepository.js";
import type { SongWriteRepository } from "../repositories/SongWriteRepository.js";

export type SongProductionResult = {
  title: string;
  genre: string;
  bpm: number;
  key: string;
  mood: string;
  energy: number;
  productionDirection: string;
  vocalStyle: string;
  arrangement: unknown[];
  instrumentation: string[];
  drums: string[];
  bass: string[];
  mixDirection: string[];
  masterDirection: string[];
};

export class SongProductionAgent {
  async produce(
    song: Awaited<ReturnType<SongRepository["findById"]>>,
    plan: Awaited<ReturnType<SongPlanRepository["findBySongId"]>>,
    writing: Awaited<ReturnType<SongWriteRepository["findBySongId"]>>,
  ): Promise<SongProductionResult> {
    if (!song) {
      throw new Error("Song production requires a song.");
    }

    if (!plan) {
      throw new Error(
        `Song production requires a plan: ${song.id}`,
      );
    }

    if (!writing) {
      throw new Error(
        `Song production requires writing: ${song.id}`,
      );
    }

    const bpm = Number(plan.bpm);

    if (!Number.isFinite(bpm) || bpm <= 0) {
      throw new Error(
        `Invalid production BPM for song: ${song.id}`,
      );
    }

    const energy = Number(plan.energy);

    return {
      title: song.title,
      genre: song.genre,
      bpm,
      key: plan.key,
      mood: song.mood,
      energy: Number.isFinite(energy) ? energy : 5,

      productionDirection:
        plan.productionDirection,

      vocalStyle:
        plan.vocalStyle,

      arrangement:
        Array.isArray(plan.structure)
          ? plan.structure
          : [],

      instrumentation: [
        "drums",
        "sub bass",
        "bass",
        "primary musical motif",
        "atmospheric textures",
        "vocal production",
      ],

      drums: [
        "kick and snare foundation",
        "genre-appropriate percussion",
        "controlled hi-hat variation",
        "transitional fills",
      ],

      bass: [
        "sub-bass foundation",
        "bass movement following arrangement",
        "controlled low-frequency dynamics",
      ],

      mixDirection: [
        "preserve vocal intelligibility",
        "maintain mono-compatible low end",
        "control competing midrange elements",
        "use automation for arrangement dynamics",
      ],

      masterDirection: [
        "controlled low-end headroom",
        "preserve transient definition",
        "avoid excessive limiting",
        "target competitive but musical loudness",
      ],
    };
  }
}
