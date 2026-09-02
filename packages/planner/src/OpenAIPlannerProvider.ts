import type {
  PlannerProvider,
  PlannerRequest,
} from "./PlannerProvider.js";

import type {
  WorkflowPlan,
} from "./WorkflowPlan.js";

import {
  PromptManager,
} from "@ampda/prompts";

interface ChatCompletionClient {
  generateChat(
    messages: Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }>,
  ): Promise<string>;
}

export class OpenAIPlannerProvider
  implements PlannerProvider
{
  constructor(
    private readonly client: ChatCompletionClient,
    private readonly prompts: PromptManager,
  ) {}

  async generate(
    request: PlannerRequest,
  ): Promise<WorkflowPlan> {

    console.log("");
    console.log("=========================================");
    console.log("PLANNER");
    console.log("=========================================");
    console.log(request);
    console.log("=========================================");
    console.log("");

    const systemPrompt =
      await this.prompts.renderAgentPrompt(
        "planner",
        {
          title:
            request.title ?? "Untitled",

          genre:
            request.genre,

          mood:
            request.mood,

          theme:
            request.theme,
        },
      );

    const response =
      await this.client.generateChat([
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: JSON.stringify(
            {
              title:
                request.title ?? "Untitled",

              genre:
                request.genre,

              mood:
                request.mood,

              theme:
                request.theme,
            },
            null,
            2,
          ),
        },
      ]);

    console.log("");
    console.log("===== PLANNER RESPONSE RECEIVED =====");
    console.log("Response type:", typeof response);
    console.log("Response length:", response?.length ?? 0);
    console.log("Response empty:", !response?.trim());
    console.log("=====================================");
    console.log("");

    let plan: WorkflowPlan;

    try {

      const extracted =
        this.extractJson(response);

      console.log("");
      console.log("===== PLANNER JSON EXTRACTION =====");
      console.log("Response length:", response.length);
      console.log("Extracted length:", extracted.length);
      console.log("Extracted JSON:");
      console.log(extracted);
      console.log("===================================");
      console.log("");

      plan =
        JSON.parse(
          extracted,
        ) as WorkflowPlan;

      console.log("");
      console.log("===== PLANNER JSON PARSED =====");
      console.log("JSON.parse succeeded.");
      console.log("================================");
      console.log("");

    } catch (error) {

      console.error("");
      console.error("===== PLANNER PARSE FAILURE =====");
      console.error("Error:", error);

      if (error instanceof Error) {
        console.error("Name:", error.name);
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
      }

      console.error("");
      console.error("Raw response:");
      console.error(response);
      console.error("=================================");
      console.error("");

      console.warn(
        "Planner returned invalid JSON; using fallback plan.",
      );

      return this.createFallbackPlan(
        request,
      );
    }

    try {

      this.validate(plan);

    } catch (error) {

      console.error("");
      console.error("===== PLANNER VALIDATION FAILURE =====");
      console.error("Error:", error);

      if (error instanceof Error) {
        console.error("Name:", error.name);
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
      }

      console.error("");
      console.error("Parsed plan:");
      console.error(
        JSON.stringify(
          plan,
          null,
          2,
        ),
      );
      console.error("=======================================");
      console.error("");

      throw error;
    }

    console.log("");
    console.log("=========================================");
    console.log("WORKFLOW PLAN");
    console.log("=========================================");
    console.log(
      JSON.stringify(
        plan,
        null,
        2,
      ),
    );
    console.log("=========================================");
    console.log("");

    return plan;
  }
  private validate(
    plan: WorkflowPlan,
  ): void {
    const song = plan.song;
    const vocals = plan.vocals;
    const production = plan.production;
    const artwork = plan.artwork;
    const release = plan.release;

    this.assertString(song.title, "WorkflowPlan missing song.title.");
    this.assertString(song.genre, "WorkflowPlan missing song.genre.");
    this.assertString(song.subgenre, "WorkflowPlan missing song.subgenre.");
    this.assertNumberInRange(song.bpm, 60, 220, "Invalid BPM.");
    this.assertString(song.key, "WorkflowPlan missing song.key.");
    this.assertString(song.duration, "WorkflowPlan missing song.duration.");
    this.assertArrayOfStrings(song.structure, 8, "WorkflowPlan invalid song.structure.");

    this.assertString(vocals.style, "WorkflowPlan missing vocals.style.");
    this.assertString(vocals.tone, "WorkflowPlan missing vocals.tone.");
    this.assertString(vocals.delivery, "WorkflowPlan missing vocals.delivery.");
    this.assertString(vocals.quality, "WorkflowPlan missing vocals.quality.");

    this.assertString(production.style, "WorkflowPlan missing production.style.");
    this.assertArrayOfStrings(production.instrumentation, 4, "WorkflowPlan invalid production.instrumentation.");
    this.assertString(production.drumStyle, "WorkflowPlan missing production.drumStyle.");
    this.assertString(production.bassStyle, "WorkflowPlan missing production.bassStyle.");
    this.assertString(production.atmosphere, "WorkflowPlan missing production.atmosphere.");
    this.assertString(production.mixDirection, "WorkflowPlan missing production.mixDirection.");
    this.assertString(production.masterDirection, "WorkflowPlan missing production.masterDirection.");

    this.assertString(artwork.style, "WorkflowPlan missing artwork.style.");
    this.assertArrayOfStrings(artwork.palette, 3, "WorkflowPlan invalid artwork.palette.");
    this.assertString(artwork.setting, "WorkflowPlan missing artwork.setting.");
    this.assertString(artwork.lighting, "WorkflowPlan missing artwork.lighting.");

    this.assertString(release.audience, "WorkflowPlan missing release.audience.");
    this.assertString(release.commercialGoal, "WorkflowPlan missing release.commercialGoal.");
    this.assertArrayOfStrings(release.platforms, 3, "WorkflowPlan invalid release.platforms.");

    if (
      !release.platforms.includes("Spotify") ||
      !release.platforms.includes("Apple Music") ||
      !release.platforms.includes("YouTube")
    ) {
      throw new Error(
        "WorkflowPlan release.platforms must include Spotify, Apple Music, and YouTube.",
      );
    }

  }

  private assertString(
    value: unknown,
    message: string,
  ): void {
    if (
      typeof value !== "string" ||
      value.trim() === ""
    ) {
      throw new Error(message);
    }
  }

  private assertNumberInRange(
    value: unknown,
    min: number,
    max: number,
    message: string,
  ): void {
    if (
      typeof value !== "number" ||
      Number.isNaN(value) ||
      value < min ||
      value > max
    ) {
      throw new Error(
        `${message} Expected ${min}-${max}.`,
      );
    }
  }

  private assertArrayOfStrings(
    value: unknown,
    minLength: number,
    message: string,
  ): void {
    if (
      !Array.isArray(value) ||
      value.length < minLength ||
      value.some(
        item =>
          typeof item !== "string" ||
          item.trim() === "",
      )
    ) {
      throw new Error(message);
    }
  }

  private extractJson(
    response: string,
  ): string {

    const fencedMatch =
      response.match(
        /```(?:json)?\s*([\s\S]*?)\s*```/i,
      );

    if (fencedMatch?.[1]) {
      return fencedMatch[1].trim();
    }

    const first =
      response.indexOf("{");

    const last =
      response.lastIndexOf("}");

    if (
      first === -1 ||
      last === -1 ||
      last <= first
    ) {
      throw new Error(
        "Planner returned no JSON object.",
      );
    }

    return response.slice(
      first,
      last + 1,
    );

  }

  private createFallbackPlan(
    request: PlannerRequest,
  ): WorkflowPlan {
    return {
      song: {
        title: request.title ?? "Untitled",
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
        mixDirection: "Wide Stereo",
        masterDirection: "Commercial Streaming",
      },
      artwork: {
        style: "Cinematic",
        palette: [
          "Black",
          "Steel Blue",
          "Grey",
        ],
        setting: "Urban",
        lighting: "Low Key",
      },
      release: {
        audience: "Hip Hop",
        commercialGoal: "Streaming",
        platforms: [
          "Spotify",
          "Apple Music",
          "YouTube",
        ],
      },
    };
  }

}
