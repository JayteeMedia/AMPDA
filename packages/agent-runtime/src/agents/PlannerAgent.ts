import type { Job } from "@ampda/job-engine";

import { BaseAgent } from "../agent/BaseAgent.js";

import type { WorkflowPlan } from "../types/WorkflowPlan.js";

export interface SongRequest {

  title?: string;

  genre: string;

  theme: string;

  mood: string;

}

export class PlannerAgent
  extends BaseAgent<
    SongRequest,
    WorkflowPlan
  >
{

  async execute(
    job: Job<
      SongRequest,
      WorkflowPlan
    >,
  ): Promise<WorkflowPlan> {

    const request =
      job.payload;

    return {

      title:
        request.title,

      genre:
        request.genre,

      mood:
        request.mood,

      theme:
        request.theme,

      //
      // Temporary planning values.
      // These will become AI-generated later.
      //

      bpm: 94,

      key: "E Minor",

      timeSignature: "4/4",

      duration: "3:20",

      vocalStyle:
        "Melodic Rap",

      productionStyle:
        "Dark Modern Hip Hop",

      artworkStyle:
        "Cinematic Urban",

      targetAudience:
        "Hip Hop",

      commercialGoal:
        "Streaming",

      structure: [

        "Intro",

        "Verse 1",

        "Hook",

        "Verse 2",

        "Hook",

        "Bridge",

        "Hook",

        "Outro",

      ],

      steps: [

        "Generate Lyrics",

        "Generate Music Prompt",

        "Generate Artwork Prompt",

        "Generate Metadata",

        "Export Project",

      ],

    };

  }

}
