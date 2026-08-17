import type { Job } from "@ampda/job-engine";

import { BaseAgent } from "../agent/BaseAgent.js";

import type {
  ArtworkGenerationResult,
  ArtworkProvider,
} from "../providers/ArtworkProvider.js";

export interface ArtworkGeneratorRequest {
  prompt: string;
}

export class ArtworkGeneratorAgent
  extends BaseAgent<
    ArtworkGeneratorRequest,
    ArtworkGenerationResult
  >
{
  constructor(
    context: ConstructorParameters<
      typeof BaseAgent<
        ArtworkGeneratorRequest,
        ArtworkGenerationResult
      >
    >[0],
    private readonly provider: ArtworkProvider,
  ) {
    super(context);
  }

  async execute(
    job: Job<
      ArtworkGeneratorRequest,
      ArtworkGenerationResult
    >,
  ): Promise<ArtworkGenerationResult> {
    return this.provider.generate({
      prompt: job.payload.prompt,
    });
  }
}
