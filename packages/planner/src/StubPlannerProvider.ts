import type {
  PlannerProvider,
  PlannerRequest,
} from "./PlannerProvider.js";

import type {
  WorkflowPlan,
} from "./WorkflowPlan.js";

export class StubPlannerProvider
  implements PlannerProvider
{
  async generate(
    request: PlannerRequest,
  ): Promise<WorkflowPlan> {

    return {

      song: {

        title: request.title,

        genre: request.genre,

        subgenre: request.genre,

        bpm: 140,

        key: "F Minor",

        duration: "3:15",

        structure: [
          "Intro",
          "Verse 1",
          "Pre-Chorus",
          "Chorus",
          "Verse 2",
          "Bridge",
          "Final Chorus",
          "Outro",
        ],

      },

      vocals: {

        style: "Melodic Rap",

        tone: request.mood,

        delivery: "Confident",

        quality: "Studio",

      },

      production: {

        style: "Dark Trap",

        instrumentation: [
          "808",
          "Piano",
          "Strings",
          "Pads",
        ],

        drumStyle: "Trap",

        bassStyle: "808",

        atmosphere: request.mood,

        mixDirection: "Wide",

        masterDirection: "Commercial",

      },

      artwork: {

        style: "Cinematic",

        palette: [
          "Black",
          "Blue",
        ],

        setting: "Urban",

        lighting: "Low Key",

      },

      release: {

        audience: "Hip Hop",

        commercialGoal: "Streaming",

      },

    };

  }

}