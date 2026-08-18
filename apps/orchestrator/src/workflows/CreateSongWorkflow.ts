import { AgentCompositionRoot, AgentExecutor } from "@ampda/agent-runtime";
import type { LyricsRequest, LyricsResult } from "@ampda/agent-runtime";
import type { Job } from "@ampda/job-engine";
import { JobPriority, JobStatus } from "@ampda/job-engine";

export interface CreateSongRequest {
  title: string;
  genre: string;
  mood: string;
  theme: string;
  outputDirectory: string;
}

export interface CreateSongResult {
  projectDirectory: string;
  lyrics: string;
  musicPrompt: string;
  artworkPrompt: string;
  metadata: {
    title: string;
    genre: string;
    mood: string;
    theme: string;
    tags: string[];
    description: string;
  };
}

export class CreateSongWorkflow {
  private readonly registry = AgentCompositionRoot.createRegistry();
  private readonly executor = new AgentExecutor();

  async execute(
    request: CreateSongRequest,
  ): Promise<CreateSongResult> {
    const planner = this.registry.resolve("planner");
    const lyricsAgent = this.registry.resolve("lyrics");
    const promptAgent = this.registry.resolve("prompt");
    const musicAgent = this.registry.resolve("music");
    const artworkAgent = this.registry.resolve("artwork");
    const metadataAgent = this.registry.resolve("metadata");

    // 1. Planner
    const planJob = this.createJob("planner-job", "Plan generation", request);
    await this.executor.execute(planner as any, planJob);

    // 2. Lyrics
    const lyricsJob = this.createJob("lyrics-job", "Lyrics generation", request);
    const lyricsResult = await this.executor.execute(lyricsAgent as any, lyricsJob) as any;
    const lyrics = lyricsResult.lyrics;

    // 3. Prompts
    const promptRequest = { ...request, lyrics };
    const promptJob = this.createJob("prompt-job", "Prompt generation", promptRequest);
    const promptResult = await this.executor.execute(promptAgent as any, promptJob) as any;
    const musicPrompt = promptResult.musicPrompt;
    const artworkPrompt = promptResult.artworkPrompt;

    // 4. Music
    const musicJob = this.createJob("music-job", "Music generation", { prompt: musicPrompt });
    await this.executor.execute(musicAgent as any, musicJob);

    // 5. Artwork
    const artworkJob = this.createJob("artwork-job", "Artwork generation", { prompt: artworkPrompt });
    await this.executor.execute(artworkAgent as any, artworkJob);

    // 6. Metadata
    const metadataJob = this.createJob("metadata-job", "Metadata generation", promptRequest);
    const metadataResult = await this.executor.execute(metadataAgent as any, metadataJob) as any;
    const metadata = metadataResult.metadata;

    return {
      projectDirectory: request.outputDirectory,
      lyrics,
      musicPrompt,
      artworkPrompt,
      metadata,
    };
  }

  private createJob<TPayload>(id: string, name: string, payload: TPayload): Job<TPayload, unknown> {
    return {
      id,
      name,
      payload,
      priority: JobPriority.Normal,
      status: JobStatus.Pending,
      metadata: {},
      createdAt: new Date(),
    };
  }
}
