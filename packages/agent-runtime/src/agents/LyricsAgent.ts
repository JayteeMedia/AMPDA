import type { Job } from "@ampda/job-engine";

import { BaseAgent } from "../agent/BaseAgent.js";
import type { LyricsProvider, LyricsGenerationResult } from "../providers/LyricsProvider.js";

export interface LyricsRequest {
  title?: string;
  genre: string;
  theme: string;
  mood: string;
}

export interface LyricsResult {
  lyrics: string;
}

export class LyricsAgent
  extends BaseAgent<
    LyricsRequest,
    LyricsResult
  >
{
  constructor(
    context: ConstructorParameters<
      typeof BaseAgent<
        LyricsRequest,
        LyricsResult
      >
    >[0],
    private readonly provider: LyricsProvider,
  ) {
    super(context);
  }

  async execute(
    job: Job<
      LyricsRequest,
      LyricsResult
    >,
  ): Promise<LyricsResult> {
    return this.provider.generate(job.payload);
  }
}
