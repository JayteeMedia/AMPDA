import { randomUUID } from "node:crypto";

import { AgentRegistry, AgentExecutor } from "@ampda/agent-runtime";
import type { SongMetadata } from "@ampda/agent-runtime";
import type { Job } from "@ampda/job-engine";
import { JobPriority, JobStatus } from "@ampda/job-engine";
import { ProjectExporter } from "@ampda/project-export";
import type { ProjectManifest, WorkflowManifest } from "@ampda/project-export";

import { AgentCompositionRoot } from "../bootstrap/AgentCompositionRoot.js";

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
  metadata: SongMetadata;
}

export class CreateSongWorkflow {
  private readonly registry: AgentRegistry;
  private readonly executor = new AgentExecutor();
  private readonly exporter = new ProjectExporter();

  constructor(registry?: AgentRegistry) {
    this.registry = registry ?? AgentCompositionRoot.createRegistry();
  }

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
    const lyricsJob = this.createJob("lyrics-job", "Lyrics generation", {
      title: request.title,
      genre: request.genre,
      theme: request.theme,
      mood: request.mood,
    });
    const lyricsResult = await this.executor.execute(lyricsAgent as any, lyricsJob) as any;
    const lyrics = lyricsResult.lyrics as string;

    // 3. Prompts
    const promptRequest = {
      title: request.title,
      genre: request.genre,
      theme: request.theme,
      mood: request.mood,
      lyrics,
    };
    const promptJob = this.createJob("prompt-job", "Prompt generation", promptRequest);
    const promptResult = await this.executor.execute(promptAgent as any, promptJob) as any;
    const musicPrompt = promptResult.musicPrompt as string;
    const artworkPrompt = promptResult.artworkPrompt as string;

    // 4. Music (queued for future integration)
    const musicJob = this.createJob("music-job", "Music generation", { prompt: musicPrompt });
    await this.executor.execute(musicAgent as any, musicJob);

    // 5. Artwork (queued for future integration)
    const artworkJob = this.createJob("artwork-job", "Artwork generation", { prompt: artworkPrompt });
    await this.executor.execute(artworkAgent as any, artworkJob);

    // 6. Metadata
    const metadataJob = this.createJob("metadata-job", "Metadata generation", {
      title: request.title,
      genre: request.genre,
      mood: request.mood,
      theme: request.theme,
      lyrics,
    });
    const metadataResult = await this.executor.execute(metadataAgent as any, metadataJob) as any;
    const metadata = metadataResult.metadata as SongMetadata;

    // 7. Export project files to disk
    const projectId = randomUUID();
    const now = new Date().toISOString();

    const manifest: ProjectManifest = {
      id: projectId,
      title: request.title,
      createdAt: now,
      genre: request.genre,
      mood: request.mood,
      theme: request.theme,
      files: {
        lyrics: "lyrics.md",
        musicPrompt: "music-prompt.txt",
        artworkPrompt: "artwork-prompt.txt",
        metadata: "metadata.json",
        workflow: "workflow.json",
      },
    };

    const workflow: WorkflowManifest = {
      version: "1.0",
      generatedAt: now,
      status: "completed",
      steps: [
        "Plan generation",
        "Lyrics generation",
        "Prompt generation",
        "Music generation",
        "Artwork generation",
        "Metadata generation",
        "Project export",
      ],
      request: {
        title: request.title,
        genre: request.genre,
        mood: request.mood,
        theme: request.theme,
      },
    };

    await this.exporter.export({
      outputDirectory: request.outputDirectory,
      lyrics,
      musicPrompt,
      artworkPrompt,
      metadata,
      manifest,
      workflow,
    });

    return {
      projectDirectory: request.outputDirectory,
      lyrics,
      musicPrompt,
      artworkPrompt,
      metadata,
    };
  }

  private createJob<TPayload>(
    id: string,
    name: string,
    payload: TPayload,
  ): Job<TPayload, unknown> {
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
