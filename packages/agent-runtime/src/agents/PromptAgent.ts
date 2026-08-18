import type { Job } from "@ampda/job-engine";

import { BaseAgent } from "../agent/BaseAgent.js";
import type { PromptProvider, PromptGenerationResult } from "../providers/PromptProvider.js";

export interface PromptRequest {
  title?: string;
  genre: string;
  theme: string;
  mood: string;
  lyrics: string;
}

export interface PromptResult {
  musicPrompt: string;
  artworkPrompt: string;
}

export class PromptAgent
  extends BaseAgent<
    PromptRequest,
    PromptResult
  >
{
  constructor(
    context: ConstructorParameters<
      typeof BaseAgent<
        PromptRequest,
        PromptResult
      >
    >[0],
    private readonly provider: PromptProvider,
  ) {
    super(context);
  }

  async execute(
    job: Job<
      PromptRequest,
      PromptResult
    >,
  ): Promise<PromptResult> {
    return this.provider.generate(job.payload);
  }
}
