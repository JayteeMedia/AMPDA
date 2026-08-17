import type { Job } from "@ampda/job-engine";

import { BaseAgent } from "../agent/BaseAgent.js";

import type {
  MetadataGenerationResult,
  MetadataProvider,
} from "../providers/MetadataProvider.js";

export interface MetadataGeneratorRequest {
  title: string;

  genre: string;

  mood: string;

  theme: string;

  lyrics: string;
}

export class MetadataGeneratorAgent
  extends BaseAgent<
    MetadataGeneratorRequest,
    MetadataGenerationResult
  >
{
  constructor(
    context: ConstructorParameters<
      typeof BaseAgent<
        MetadataGeneratorRequest,
        MetadataGenerationResult
      >
    >[0],
    private readonly provider: MetadataProvider,
  ) {
    super(context);
  }

  async execute(
    job: Job<
      MetadataGeneratorRequest,
      MetadataGenerationResult
    >,
  ): Promise<MetadataGenerationResult> {

    return this.provider.generate(
      job.payload,
    );
  }
}
