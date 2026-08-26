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

import type { OpenAIClient } from "@ampda/openai-provider";

export class OpenAIPlannerProvider
  implements PlannerProvider
{
  constructor(
    private readonly client: OpenAIClient,
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

    let plan: WorkflowPlan;

    try {

      plan =
        JSON.parse(
          response,
        ) as WorkflowPlan;

    } catch {

      throw new Error(
        [
          "Planner returned invalid JSON.",
          "",
          "Response:",
          response,
        ].join("\n"),
      );

    }

    this.validate(
      plan,
    );

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

    if (!plan.song.title)
      throw new Error(
        "WorkflowPlan missing song.title.",
      );

    if (!plan.song.genre)
      throw new Error(
        "WorkflowPlan missing song.genre.",
      );

    if (
      plan.song.bpm < 60 ||
      plan.song.bpm > 220
    ) {
      throw new Error(
        `Invalid BPM: ${plan.song.bpm}`,
      );
    }

    if (
      !plan.song.key ||
      plan.song.key.trim() === ""
    ) {
      throw new Error(
        "WorkflowPlan missing key.",
      );
    }

    if (
      plan.song.structure.length === 0
    ) {
      throw new Error(
        "WorkflowPlan contains no song structure.",
      );
    }

    if (
      !plan.production.instrumentation.length
    ) {
      throw new Error(
        "WorkflowPlan contains no instrumentation.",
      );
    }

  }

}

