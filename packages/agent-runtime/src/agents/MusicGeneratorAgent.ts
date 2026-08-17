import type { Job } from "@ampda/job-engine";

import { BaseAgent } from "../agent/BaseAgent.js";
import type {
  MusicGenerationResult,
  MusicProvider,
} from "../providers/MusicProvider.js";

export interface MusicGeneratorRequest {
  prompt: string;
}

export class MusicGeneratorAgent
  extends BaseAgent<
    MusicGeneratorRequest,
    MusicGenerationResult
  >
{
  constructor(
    context: ConstructorParameters<
      typeof BaseAgent<
        MusicGeneratorRequest,
        MusicGenerationResult
      >
    >[0],
    private readonly provider: MusicProvider,
  ) {
    super(context);
  }

  async execute(
    job: Job<
      MusicGeneratorRequest,
      MusicGenerationResult
    >,
  ): Promise<MusicGenerationResult> {
    return this.provider.generate({
      prompt: job.payload.prompt,
    });
  }
}
