import type {
  Song,
  SongPlanningResult,
} from "./SongPlanningAgent.js";

import type {
  SongWritingResult,
} from "./SongWritingAgent.js";

export type SongProductionInput = {
  song: Song;
  plan: SongPlanningResult;
  writing: SongWritingResult;
};

export type SongProductionResult = {
  title: string;
  genre: string;
  mood: string;
  theme: string;

  bpm: number;
  key: string;
  energy: number;

  vocalStyle: string;
  productionDirection: string;

  drumDirection: string;
  bassDirection: string;
  melodicDirection: string;
  atmosphericDirection: string;

  arrangement: string[];

  vocalProduction: string;

  mixDirection: string;

  masterDirection: string;

  deliverables: string[];

  productionNotes: string;
};

export class ProductionAgent {
  async produce(
    input: SongProductionInput,
  ): Promise<SongProductionResult> {
    const {
      song,
      plan,
      writing,
    } = input;

    const arrangement =
      plan.structure.map(
        (section, index) =>
          `${index + 1}. ${section}`,
      );

    return {
      title: song.title,

      genre: song.genre,

      mood: song.mood,

      theme: song.theme,

      bpm: plan.bpm,

      key: plan.key,

      energy: plan.energy,

      vocalStyle:
        plan.vocalStyle,

      productionDirection:
        plan.productionDirection,

      drumDirection:
        "Punchy modern drums with a controlled kick/sub relationship, crisp percussion, restrained hi-hat density, and arrangement changes that reinforce section transitions.",

      bassDirection:
        "Deep controlled sub bass following the harmonic foundation with additional low-mid texture where required. Preserve headroom for the kick and maintain mono compatibility in the sub region.",

      melodicDirection:
        "Use a restrained melodic palette supporting the song concept without overcrowding the vocal. Build harmonic movement through layered keys, pads, textures, and selective melodic accents.",

      atmosphericDirection:
        `Create a ${song.mood} atmospheric environment around the theme "${song.theme}". Use transitions, ambience, tonal textures, and controlled space to create depth while preserving vocal intelligibility.`,

      arrangement,

      vocalProduction:
        `${writing.vocalDirection} Keep the lead vocal centered and intelligible. Use controlled compression, corrective EQ, de-essing, tasteful saturation, short ambience, and tempo-synced delays where appropriate. Increase width primarily through doubles, harmonies, and effects rather than excessive widening of the lead.`,

      mixDirection:
        "Prioritize vocal intelligibility, kick/sub separation, controlled low-end, balanced midrange, and restrained high-frequency energy. Maintain meaningful dynamic contrast between verses, hooks, bridge, and final section.",

      masterDirection:
        "Prepare a clean, competitive master with controlled dynamics, preserved transient information, stable low-end, and sufficient headroom for downstream distribution processing. Avoid destructive loudness chasing.",

      deliverables: [
        "production.json",
        "production.spec.txt",
        "mix-notes.txt",
        "master-notes.txt",
      ],

      productionNotes:
        `Production specification generated for "${song.title}". ` +
        `The arrangement follows the approved ${plan.structure.length}-section song structure. ` +
        `The production direction is based on the approved planning result and writing direction. ` +
        `Lyrics structure contains ${writing.structure.length} sections.`,
    };
  }
}
