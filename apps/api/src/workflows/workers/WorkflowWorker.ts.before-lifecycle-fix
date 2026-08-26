import {
  WorkflowJobRepository,
} from "../repositories/WorkflowJobRepository.js";

import {
  SongPlanRepository,
} from "../repositories/SongPlanRepository.js";

import {
  SongWriteRepository,
} from "../repositories/SongWriteRepository.js";

import {
  SongPlanningAgent,
} from "../agents/SongPlanningAgent.js";

import {
  SongWritingAgent,
} from "../agents/SongWritingAgent.js";

import {
  ProductionAgent,
} from "../agents/ProductionAgent.js";

import {
  SongRepository,
} from "../../repositories/SongRepository.js";

import {
  SongAssetManager,
} from "../../services/SongAssetManager.js";

import {
  AssetIntegrityService,
} from "../../services/AssetIntegrityService.js";

import {
  WorkflowService,
} from "../services/WorkflowService.js";

import {
  SongService,
} from "../../services/SongService.js";

import type {
  SongPlanningResult,
} from "../agents/SongPlanningAgent.js";

import type {
  WorkflowJob,
} from "../types.js";

export type WorkflowWorkerOptions = {
  maxJobsPerRun?: number;

  songRepository?: SongRepository;

  planningAgent?: SongPlanningAgent;

  songPlanRepository?: SongPlanRepository;

  writingAgent?: SongWritingAgent;

  songWriteRepository?: SongWriteRepository;

  productionAgent?: ProductionAgent;

  assetManager?: SongAssetManager;

  assetIntegrityService?: AssetIntegrityService;

  workflowService?: WorkflowService;

  songService?: SongService;
};

export class WorkflowWorker {
  private readonly maxJobsPerRun: number;

  private readonly songRepository:
    SongRepository;

  private readonly planningAgent:
    SongPlanningAgent;

  private readonly songPlanRepository:
    SongPlanRepository;

  private readonly writingAgent:
    SongWritingAgent;

  private readonly songWriteRepository:
    SongWriteRepository;

  private readonly productionAgent:
    ProductionAgent;

  private readonly assetManager:
    SongAssetManager;

  private readonly assetIntegrityService:
    AssetIntegrityService;

  private readonly workflowService:
    WorkflowService;

  private readonly songService:
    SongService;

  constructor(
    private readonly repository:
      WorkflowJobRepository,

    options: WorkflowWorkerOptions = {},
  ) {
    this.maxJobsPerRun =
      options.maxJobsPerRun ??
      Number.POSITIVE_INFINITY;

    this.songRepository =
      options.songRepository ??
      new SongRepository();

    this.planningAgent =
      options.planningAgent ??
      new SongPlanningAgent();

    this.songPlanRepository =
      options.songPlanRepository ??
      new SongPlanRepository();

    this.writingAgent =
      options.writingAgent ??
      new SongWritingAgent();

    this.songWriteRepository =
      options.songWriteRepository ??
      new SongWriteRepository();

    this.productionAgent =
      options.productionAgent ??
      new ProductionAgent();

    this.assetManager =
      options.assetManager ??
      new SongAssetManager();

    this.assetIntegrityService =
      options.assetIntegrityService ??
      new AssetIntegrityService(
        this.assetManager,
      );

    this.workflowService =
      options.workflowService ??
      new WorkflowService(
        repository,
      );

    this.songService =
      options.songService ??
      new SongService(
        this.songRepository,
        this.workflowService,
      );
  }

  async processNext():
    Promise<WorkflowJob | null> {

    const job =
      await this.repository.claimPending();

    if (!job) {
      return null;
    }

    console.log(
      `[WorkflowWorker] claimed job=${job.id} ` +
      `type=${job.type} ` +
      `song=${job.songId}`,
    );

    try {
      await this.synchronizeJobStatus(job);

      await this.execute(job);

      const completed =
        await this.repository.markCompleted(
          job.id,
        );

      console.log(
        `[WorkflowWorker] completed job=${job.id} ` +
        `type=${job.type} ` +
        `song=${job.songId}`,
      );

      return completed;

    } catch (error) {

      try {
        await this.repository.markFailed(
          job.id,
          error,
        );

      } catch (failureError) {

        console.error(
          `[WorkflowWorker] failed to persist ` +
          `failure state job=${job.id}`,
          failureError,
        );
      }

      throw error;
    }
  }

  async processAll(): Promise<number> {

    let processed = 0;

    while (
      processed <
      this.maxJobsPerRun
    ) {
      const job =
        await this.processNext();

      if (!job) {
        break;
      }

      processed += 1;
    }

    return processed;
  }

  private async synchronizeJobStatus(
    job: WorkflowJob,
  ): Promise<void> {

    const song =
      await this.requireSong(
        job.songId,
      );

    const expectedStatus =
      ({
        song_planning: "queued",
        song_writing: "planning",
        song_production: "writing",
        song_review: "production",
        song_release: "approved",
      } as const)[job.type];

    if (!expectedStatus) {
      return;
    }

    if (
      song.status !== expectedStatus
    ) {
      throw new Error(
        `Workflow status mismatch: ` +
        `job=${job.id} ` +
        `type=${job.type} ` +
        `song=${song.id} ` +
        `current=${song.status} ` +
        `expected=${expectedStatus}`,
      );
    }

    console.log(
      `[WorkflowWorker] status validated ` +
      `song=${song.id} ` +
      `status=${song.status} ` +
      `job=${job.id} ` +
      `type=${job.type}`,
    );
  }
  private async execute(
    job: WorkflowJob,
  ): Promise<void> {

    switch (job.type) {

      case "song_planning":
        await this.executeSongPlanning(
          job,
        );
        return;

      case "song_writing":
        await this.executeSongWriting(
          job,
        );
        return;

      case "song_production":
        await this.executeSongProduction(
          job,
        );
        return;

      case "song_review":
        await this.executeSongReview(
          job,
        );
        return;

      case "song_release":
        await this.executeSongRelease(
          job,
        );
        return;

      default:
        throw new Error(
          `Unsupported workflow job type: ${job.type}`,
        );
    }
  }

  private async executeSongPlanning(
    job: WorkflowJob,
  ): Promise<void> {

    console.log(
      `[WorkflowWorker] planning job=${job.id} ` +
      `song=${job.songId}`,
    );

    const song =
      await this.requireSong(
        job.songId,
      );

    let plan =
      await this.songPlanRepository.findBySongId(
        job.songId,
      );

    if (!plan) {

      const result =
        await this.planningAgent.plan(
          song,
        );

      await this.songPlanRepository.create({
        songId: job.songId,
        result,
      });

      plan =
        await this.songPlanRepository.findBySongId(
          job.songId,
        );
    }

    if (!plan) {
      throw new Error(
        `Song plan could not be created: ${job.songId}`,
      );
    }

    const planAsset =
      await this.writePlanAsset(
        song,
        plan,
      );

    console.log(
      `[WorkflowWorker] plan asset verified/written ` +
      `path=${planAsset}`,
    );

    console.log(
      `[WorkflowWorker] writing job queued ` +
      `song=${job.songId}`,
    );
  }

  private async executeSongWriting(
    job: WorkflowJob,
  ): Promise<void> {

    console.log(
      `[WorkflowWorker] writing job=${job.id} ` +
      `song=${job.songId}`,
    );

    const song =
      await this.requireSong(
        job.songId,
      );

    const plan =
      await this.songPlanRepository.findBySongId(
        job.songId,
      );

    if (!plan) {
      throw new Error(
        `Song plan not found: ${job.songId}`,
      );
    }

    const existingWrite =
      await this.songWriteRepository.findBySongId(
        job.songId,
      );

    if (existingWrite) {

      console.log(
        `[WorkflowWorker] writing already exists ` +
        `song=${job.songId}`,
      );

      const lyricsIntegrity =
        await this.assetIntegrityService.verifyOrRestore({
          songId: song.id,
          filename: "lyrics.txt",
          type: "lyrics",
          content: existingWrite.lyrics,
        });

      if (lyricsIntegrity.restored) {

        console.log(
          `[WorkflowWorker] missing lyrics asset restored ` +
          `path=${lyricsIntegrity.absolutePath}`,
        );

      } else {

        console.log(
          `[WorkflowWorker] lyrics asset already exists ` +
          `song=${song.id}`,
        );
      }      
      if (song.status !== "writing") {
        await this.songService.updateStatus(
          song.id,
          "writing",
        );
      }

      console.log(
        `[WorkflowWorker] writing already complete ` +
        `song=${song.id} ` +
        `next=production`,
      );

      return;
    }

    const writingResult =
      await this.writingAgent.write(
        song,
        plan,
      );

    await this.songWriteRepository.create({
      songId: job.songId,
      result: writingResult,
    });

    const lyricsIntegrity =
      await this.assetIntegrityService.verifyOrRestore({
        songId: song.id,
        filename: "lyrics.txt",
        type: "lyrics",
        content: writingResult.lyrics,
      });

    console.log(
      `[WorkflowWorker] writing completed ` +
      `job=${job.id} ` +
      `song=${job.songId} ` +
      `structure=${writingResult.structure.length} ` +
      `asset=${lyricsIntegrity.absolutePath}`,
    );

    if (song.status !== "writing") {
      await this.songService.updateStatus(
        song.id,
        "writing",
      );
    }
    console.log(
      `[WorkflowWorker] writing completed ` +
      `job=${job.id} ` +
      `song=${job.songId} ` +
      `next=production`,
    );

    console.log(
      `[WorkflowWorker] production job queued ` +
      `song=${job.songId}`,
    );
  }

  private async executeSongProduction(
    job: WorkflowJob,
  ): Promise<void> {

    console.log(
      `[WorkflowWorker] production job=${job.id} ` +
      `song=${job.songId}`,
    );

    const song =
      await this.requireSong(
        job.songId,
      );

    const plan =
      await this.songPlanRepository.findBySongId(
        job.songId,
      );

    if (!plan) {
      throw new Error(
        `Song plan not found for production: ${job.songId}`,
      );
    }

    const writing =
      await this.songWriteRepository.findBySongId(
        job.songId,
      );

    if (!writing) {
      throw new Error(
        `Song writing not found for production: ${job.songId}`,
      );
    }

    const productionAsset =
      await this.assetIntegrityService.verify(
        song.id,
        "production.json",
      );

    if (productionAsset.exists) {

      console.log(
        `[WorkflowWorker] production already exists ` +
        `song=${song.id}`,
      );

      await this.restoreProductionSupportAssets(
        song.id,
      );

      return;
    }

    const production =
      await this.productionAgent.produce({
        song,
        plan: {
          title: song.title,
          genre: song.genre,
          mood: song.mood,
          theme: song.theme,
          concept: plan.concept,
          structure: plan.structure,
          bpm: plan.bpm,
          key: plan.key,
          energy: plan.energy,
          vocalStyle: plan.vocalStyle,
          productionDirection:
            plan.productionDirection,
        },
        writing: {
          lyrics: writing.lyrics,
          structure: writing.structure,
          vocalDirection:
            writing.vocalDirection,
          writingNotes:
            writing.writingNotes,
        },
      });

    const productionJson =
      JSON.stringify(
        production,
        null,
        2,
      );

    const productionIntegrity =
      await this.assetIntegrityService.verifyOrRestore({
        songId: song.id,
        filename: "production.json",
        type: "production",
        content: productionJson,
      });

    await this.assetIntegrityService.verifyOrRestore({
      songId: song.id,
      filename: "production.spec.txt",
      type: "production",
      content: this.buildProductionSpec(
        production,
      ),
    });

    await this.assetIntegrityService.verifyOrRestore({
      songId: song.id,
      filename: "mix-notes.txt",
      type: "production",
      content: production.mixDirection,
    });

    await this.assetIntegrityService.verifyOrRestore({
      songId: song.id,
      filename: "master-notes.txt",
      type: "production",
      content: production.masterDirection,
    });

    console.log(
      `[WorkflowWorker] production completed ` +
      `job=${job.id} ` +
      `song=${job.songId} ` +
      `asset=${productionIntegrity.absolutePath}`,
    );

    await this.songService.updateStatus(
      song.id,
      "review",
    );

    console.log(
      `[WorkflowWorker] production completed ` +
      `job=${job.id} ` +
      `song=${job.songId} ` +
      `asset=${productionIntegrity.absolutePath} ` +
      `next=review`,
    );
  }

  private async restoreProductionSupportAssets(
    songId: string,
  ): Promise<void> {

    const productionPath =
      await this.assetManager.readText(
        songId,
        "production.json",
      );

    let production:
      Record<string, unknown>;

    try {
      production =
        JSON.parse(
          productionPath,
        );
    } catch {
      throw new Error(
        `Invalid production.json: ${songId}`,
      );
    }

    const productionSpec =
      this.buildProductionSpec(
        production,
      );

    await this.assetIntegrityService.verifyOrRestore({
      songId,
      filename: "production.spec.txt",
      type: "production",
      content: productionSpec,
    });

    if (
      typeof production.mixDirection ===
      "string"
    ) {
      await this.assetIntegrityService.verifyOrRestore({
        songId,
        filename: "mix-notes.txt",
        type: "production",
        content:
          production.mixDirection,
      });
    }

    if (
      typeof production.masterDirection ===
      "string"
    ) {
      await this.assetIntegrityService.verifyOrRestore({
        songId,
        filename: "master-notes.txt",
        type: "production",
        content:
          production.masterDirection,
      });
    }
  }

  private buildProductionSpec(
    production:
      Record<string, unknown>,
  ): string {

    const lines: string[] = [];

    const add =
      (
        label: string,
        value: unknown,
      ) => {
        lines.push(
          `${label}: ${String(value ?? "")}`,
        );
      };

    add(
      "TITLE",
      production.title,
    );

    add(
      "GENRE",
      production.genre,
    );

    add(
      "MOOD",
      production.mood,
    );

    add(
      "THEME",
      production.theme,
    );

    add(
      "BPM",
      production.bpm,
    );

    add(
      "KEY",
      production.key,
    );

    add(
      "ENERGY",
      production.energy,
    );

    lines.push("");

    add(
      "VOCAL STYLE",
      production.vocalStyle,
    );

    add(
      "PRODUCTION DIRECTION",
      production.productionDirection,
    );

    add(
      "DRUM DIRECTION",
      production.drumDirection,
    );

    add(
      "BASS DIRECTION",
      production.bassDirection,
    );

    add(
      "MELODIC DIRECTION",
      production.melodicDirection,
    );

    add(
      "ATMOSPHERIC DIRECTION",
      production.atmosphericDirection,
    );

    add(
      "VOCAL PRODUCTION",
      production.vocalProduction,
    );

    add(
      "MIX DIRECTION",
      production.mixDirection,
    );

    add(
      "MASTER DIRECTION",
      production.masterDirection,
    );

    lines.push("");

    lines.push(
      "ARRANGEMENT:",
    );

    if (
      Array.isArray(
        production.arrangement,
      )
    ) {
      for (
        const section
        of production.arrangement
      ) {
        lines.push(
          `- ${String(section)}`,
        );
      }
    }

    lines.push("");

    lines.push(
      "DELIVERABLES:",
    );

    if (
      Array.isArray(
        production.deliverables,
      )
    ) {
      for (
        const deliverable
        of production.deliverables
      ) {
        lines.push(
          `- ${String(deliverable)}`,
        );
      }
    }

    lines.push("");

    add(
      "PRODUCTION NOTES",
      production.productionNotes,
    );

    return lines.join("\n");
  }

  private async executeSongReview(
    job: WorkflowJob,
  ): Promise<void> {

    console.log(
      `[WorkflowWorker] review job=${job.id} ` +
      `song=${job.songId}`,
    );

    const song =
      await this.requireSong(
        job.songId,
      );

    const plan =
      await this.songPlanRepository.findBySongId(
        job.songId,
      );

    if (!plan) {
      throw new Error(
        `Song plan not found for review: ${job.songId}`,
      );
    }

    const writing =
      await this.songWriteRepository.findBySongId(
        job.songId,
      );

    if (!writing) {
      throw new Error(
        `Song writing not found for review: ${job.songId}`,
      );
    }

    const requiredAssets = [
      "plan.json",
      "lyrics.txt",
      "production.json",
      "production.spec.txt",
      "mix-notes.txt",
      "master-notes.txt",
    ];

    const missingAssets: string[] = [];

    for (
      const filename of requiredAssets
    ) {
      const result =
        await this.assetIntegrityService.verify(
          song.id,
          filename,
        );

      if (!result.exists) {
        missingAssets.push(
          filename,
        );
      }
    }

    if (
      missingAssets.length > 0
    ) {
      const review = {
        songId: song.id,
        approved: false,
        score: 0,
        reviewedAt:
          new Date().toISOString(),
        checks: {
          song: true,
          plan: true,
          writing: true,
          assets: false,
        },
        issues: missingAssets.map(
          (filename) =>
            `Missing required asset: ${filename}`,
        ),
      };

      await this.assetIntegrityService.verifyOrRestore({
        songId: song.id,
        filename: "review.json",
        type: "review",
        content: JSON.stringify(
          review,
          null,
          2,
        ),
      });

      await this.songService.updateStatus(
        song.id,
        "rejected",
      );

      console.log(
        `[WorkflowWorker] review rejected ` +
        `song=${song.id} ` +
        `missing=${missingAssets.join(",")}`,
      );

      return;
    }

    let production:
      Record<string, unknown>;

    try {
      production =
        JSON.parse(
          await this.assetManager.readText(
            song.id,
            "production.json",
          ),
        );
    } catch {
      throw new Error(
        `Invalid production.json for review: ${song.id}`,
      );
    }

    const issues: string[] = [];

    if (
      !song.title.trim()
    ) {
      issues.push(
        "Song title is empty",
      );
    }

    if (
      !song.genre.trim()
    ) {
      issues.push(
        "Song genre is empty",
      );
    }

    if (
      !song.mood.trim()
    ) {
      issues.push(
        "Song mood is empty",
      );
    }

    if (
      !writing.lyrics.trim()
    ) {
      issues.push(
        "Lyrics are empty",
      );
    }

    if (
      !plan.concept.trim()
    ) {
      issues.push(
        "Song concept is empty",
      );
    }

    if (
      !Number.isFinite(plan.bpm) ||
      plan.bpm <= 0
    ) {
      issues.push(
        "Invalid BPM",
      );
    }

    if (
      !plan.key.trim()
    ) {
      issues.push(
        "Musical key is empty",
      );
    }

    if (
      !Number.isFinite(plan.energy) ||
      plan.energy < 1 ||
      plan.energy > 10
    ) {
      issues.push(
        "Energy must be between 1 and 10",
      );
    }

    if (
      typeof production.mixDirection !==
      "string" ||
      !production.mixDirection.trim()
    ) {
      issues.push(
        "Production mix direction is missing",
      );
    }

    if (
      typeof production.masterDirection !==
      "string" ||
      !production.masterDirection.trim()
    ) {
      issues.push(
        "Production master direction is missing",
      );
    }

    const approved =
      issues.length === 0;

    const score =
      approved
        ? 100
        : Math.max(
            0,
            100 -
              issues.length * 15,
          );

    const review = {
      songId: song.id,
      approved,
      score,
      reviewedAt:
        new Date().toISOString(),

      checks: {
        song: true,
        plan: true,
        writing: true,
        production: true,
        requiredAssets: true,
      },

      issues,
    };

    const reviewIntegrity =
      await this.assetIntegrityService.verifyOrRestore({
        songId: song.id,
        filename: "review.json",
        type: "review",
        content: JSON.stringify(
          review,
          null,
          2,
        ),
      });

    const reviewText = [
      `SONG REVIEW`,
      ``,
      `TITLE: ${song.title}`,
      `SONG ID: ${song.id}`,
      `STATUS: ${approved ? "APPROVED" : "REJECTED"}`,
      `SCORE: ${score}/100`,
      ``,
      `CHECKS`,
      `- Song: PASS`,
      `- Plan: PASS`,
      `- Writing: PASS`,
      `- Production: PASS`,
      `- Required Assets: PASS`,
      ``,
      `ISSUES`,
      ...(issues.length > 0
        ? issues.map(
            (issue) => `- ${issue}`,
          )
        : ["- None"]),
      ``,
      `REVIEWED AT: ${review.reviewedAt}`,
    ].join("\n");

    await this.assetIntegrityService.verifyOrRestore({
      songId: song.id,
      filename: "review.txt",
      type: "review",
      content: reviewText,
    });

    if (!approved) {
      await this.songService.updateStatus(
        song.id,
        "rejected",
      );

      console.log(
        `[WorkflowWorker] review rejected ` +
        `job=${job.id} ` +
        `song=${song.id} ` +
        `score=${score}`,
      );

      return;
    }

    await this.songService.updateStatus(
      song.id,
      "approved",
    );

    console.log(
      `[WorkflowWorker] review approved ` +
      `job=${job.id} ` +
      `song=${song.id} ` +
      `score=${score} ` +
      `asset=${reviewIntegrity.absolutePath}`,
    );
  }

  private async executeSongRelease(
    job: WorkflowJob,
  ): Promise<void> {

    console.log(
      `[WorkflowWorker] release job=${job.id} ` +
      `song=${job.songId}`,
    );

    const song =
      await this.requireSong(
        job.songId,
      );

    if (
      song.status !== "approved"
    ) {
      throw new Error(
        `Song is not approved for release: ` +
        `${song.id} status=${song.status}`,
      );
    }

    const requiredAssets = [
      "plan.json",
      "lyrics.txt",
      "production.json",
      "production.spec.txt",
      "mix-notes.txt",
      "master-notes.txt",
      "review.json",
      "review.txt",
    ];

    const missingAssets: string[] = [];

    for (
      const filename of requiredAssets
    ) {
      const result =
        await this.assetIntegrityService.verify(
          song.id,
          filename,
        );

      if (!result.exists) {
        missingAssets.push(
          filename,
        );
      }
    }

    if (
      missingAssets.length > 0
    ) {
      throw new Error(
        `Cannot release song ${song.id}. ` +
        `Missing assets: ${missingAssets.join(", ")}`,
      );
    }

    let review:
      Record<string, unknown>;

    try {
      review =
        JSON.parse(
          await this.assetManager.readText(
            song.id,
            "review.json",
          ),
        );
    } catch {
      throw new Error(
        `Invalid review.json for release: ${song.id}`,
      );
    }

    if (
      review.approved !== true
    ) {
      throw new Error(
        `Song review is not approved for release: ${song.id}`,
      );
    }

    const metadata = {
      title: song.title,
      artist: "Jay Sixx",
      genre: song.genre,
      mood: song.mood,
      theme: song.theme,
      songId: song.id,
      status: "release",
      format: "AMPDA_RELEASE_PACKAGE",
      version: "0.1.0",
      createdAt: song.createdAt,
      releasedAt:
        new Date().toISOString(),
      reviewScore:
        typeof review.score === "number"
          ? review.score
          : null,
      assets: requiredAssets,
    };

    const metadataIntegrity =
      await this.assetIntegrityService.verifyOrRestore({
        songId: song.id,
        filename: "metadata.json",
        type: "metadata",
        content: JSON.stringify(
          metadata,
          null,
          2,
        ),
      });

    const releaseManifest = [
      `AMPDA RELEASE MANIFEST`,
      ``,
      `TITLE: ${metadata.title}`,
      `ARTIST: ${metadata.artist}`,
      `GENRE: ${metadata.genre}`,
      `MOOD: ${metadata.mood}`,
      `SONG ID: ${metadata.songId}`,
      `VERSION: ${metadata.version}`,
      `STATUS: ${metadata.status}`,
      ``,
      `ASSETS`,
      ...requiredAssets.map(
        (filename) =>
          `- ${filename}`,
      ),
      ``,
      `RELEASED AT: ${metadata.releasedAt}`,
    ].join("\n");

    await this.assetIntegrityService.verifyOrRestore({
      songId: song.id,
      filename: "release-manifest.txt",
      type: "export",
      content: releaseManifest,
    });

    const releaseDirectory =
      await this.assetManager.ensureSongDirectory(
        song.id,
      );

    const releasePath =
      await this.assetIntegrityService.verifyOrRestore({
        songId: song.id,
        filename: "release.json",
        type: "export",
        content: JSON.stringify(
          {
            metadata,
            assets: requiredAssets,
            packageDirectory:
              releaseDirectory,
            generatedAt:
              new Date().toISOString(),
          },
          null,
          2,
        ),
      });

    await this.songService.updateStatus(
      song.id,
      "release",
    );

    console.log(
      `[WorkflowWorker] release completed ` +
      `job=${job.id} ` +
      `song=${song.id} ` +
      `metadata=${metadataIntegrity.absolutePath} ` +
      `manifest=${releasePath.absolutePath}`,
    );
  }

  private async writePlanAsset(
    song: Awaited<
      ReturnType<SongRepository["findById"]>
    >,
    plan: Awaited<
      ReturnType<SongPlanRepository["findBySongId"]>
    >,
  ): Promise<string> {

    if (!song) {
      throw new Error(
        "Cannot write plan asset without song",
      );
    }

    if (!plan) {
      throw new Error(
        `Cannot write plan asset without plan: ${song.id}`,
      );
    }

    const structure =
      Array.isArray(plan.structure)
        ? plan.structure
        : [];

    const asset: SongPlanningResult = {
      title: song.title,
      genre: song.genre,
      mood: song.mood,
      theme: song.theme,
      concept: plan.concept,
      structure,
      bpm: plan.bpm,
      key: plan.key,
      energy: plan.energy,
      vocalStyle: plan.vocalStyle,
      productionDirection:
        plan.productionDirection,
    };

    const integrity =
      await this.assetIntegrityService.verifyOrRestore({
        songId: song.id,
        filename: "plan.json",
        type: "plan",
        content: JSON.stringify(
          asset,
          null,
          2,
        ),
      });

    if (integrity.restored) {

      console.log(
        `[WorkflowWorker] plan asset restored ` +
        `path=${integrity.absolutePath}`,
      );

    } else {

      console.log(
        `[WorkflowWorker] plan asset already exists ` +
        `song=${song.id}`,
      );
    }

    return integrity.absolutePath;
  }

  private async requireSong(
    songId: string,
  ) {

    const song =
      await this.songRepository.findById(
        songId,
      );

    if (!song) {
      throw new Error(
        `Song not found: ${songId}`,
      );
    }

    return song;
  }
}




















