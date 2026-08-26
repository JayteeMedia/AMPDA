import type {
  SongProject,
} from "@ampda/core";

import {
  Workflow,
  WorkflowEngine,
  type WorkflowContext,
  type WorkflowStep,
} from "@ampda/workflow-engine";

import {
  AgentCapability,
  AgentJobDispatcher,
  AgentRegistry,
  ArtworkGeneratorAgent,
  LyricsAgent,
  MetadataGeneratorAgent,
  MusicGeneratorAgent,
  PlannerAgent,
  PromptAgent,
  StubArtworkProvider,
  StubLyricsProvider,
  StubMetadataProvider,
  StubMusicProvider,
  StubPromptProvider,
} from "./index.js";

import {
  StubPlannerProvider,
  type WorkflowPlan,
} from "@ampda/planner";

import {
  JobPriority,
  JobStatus,
  type Job,
} from "@ampda/job-engine";

import type {
  SongRequest,
} from "./agents/PlannerAgent.js";

import type {
  LyricsRequest,
  LyricsResult,
} from "./agents/LyricsAgent.js";

import type {
  PromptRequest,
  PromptResult,
} from "./agents/PromptAgent.js";

import type {
  MusicGeneratorRequest,
} from "./agents/MusicGeneratorAgent.js";

import type {
  MusicGenerationResult,
} from "./providers/MusicProvider.js";

import type {
  ArtworkGeneratorRequest,
} from "./agents/ArtworkGeneratorAgent.js";

import type {
  ArtworkGenerationResult,
} from "./providers/ArtworkProvider.js";

import type {
  MetadataGeneratorRequest,
} from "./agents/MetadataGeneratorAgent.js";

import type {
  MetadataGenerationResult,
} from "./providers/MetadataProvider.js";

export interface SongWorkflowRequest {
  title: string;
  genre: string;
  mood: string;
  theme: string;
}

export interface SongWorkflowState {
  request: SongWorkflowRequest;
  plan?: WorkflowPlan;
  lyrics?: LyricsResult;
  prompts?: PromptResult;
  music?: MusicGenerationResult;
  artwork?: ArtworkGenerationResult;
  metadata?: MetadataGenerationResult;
  project?: SongProject;
}

const STATE_KEY = "ampda.songWorkflow";

function getState(
  context: WorkflowContext,
): SongWorkflowState {
  const value =
    context.metadata[STATE_KEY];

  if (
    value &&
    typeof value === "object"
  ) {
    return value as SongWorkflowState;
  }

  throw new Error(
    "Song workflow state is missing.",
  );
}

function createJob<TPayload, TResult>(
  id: string,
  name: string,
  payload: TPayload,
): Job<TPayload, TResult> {
  return {
    id,
    name,
    payload,
    priority: JobPriority.Normal,
    status: JobStatus.Pending,
    context: {
      tags: ["song-workflow"],
      metadata: {},
    },
    metadata: {},
    createdAt: new Date(),
  };
}

export interface SongWorkflowRuntime {
  readonly registry: AgentRegistry;
  readonly dispatcher: AgentJobDispatcher;
  readonly engine: WorkflowEngine;
}

export function createSongWorkflowRuntime():
  SongWorkflowRuntime {
  const registry =
    new AgentRegistry();

  const planner =
    new PlannerAgent(
      {
        id: "planner-agent",
        name: "Planner Agent",
        capabilities: [
          AgentCapability.Planning,
        ],
        metadata: {},
      },
      new StubPlannerProvider(),
    );

  const lyrics =
    new LyricsAgent(
      {
        id: "lyrics-agent",
        name: "Lyrics Agent",
        capabilities: [
          AgentCapability.Lyrics,
        ],
        metadata: {},
      },
      new StubLyricsProvider(),
    );

  const prompt =
    new PromptAgent(
      {
        id: "prompt-agent",
        name: "Prompt Agent",
        capabilities: [
          AgentCapability.PromptGeneration,
        ],
        metadata: {},
      },
      new StubPromptProvider(),
    );

  const music =
    new MusicGeneratorAgent(
      {
        id: "music-agent",
        name: "Music Generator Agent",
        capabilities: [
          AgentCapability.MusicGeneration,
        ],
        metadata: {},
      },
      new StubMusicProvider(),
    );

  const artwork =
    new ArtworkGeneratorAgent(
      {
        id: "artwork-agent",
        name: "Artwork Generator Agent",
        capabilities: [
          AgentCapability.ArtworkGeneration,
        ],
        metadata: {},
      },
      new StubArtworkProvider(),
    );

  const metadata =
    new MetadataGeneratorAgent(
      {
        id: "metadata-agent",
        name: "Metadata Generator Agent",
        capabilities: [
          AgentCapability.MetadataGeneration,
        ],
        metadata: {},
      },
      new StubMetadataProvider(),
    );

  registry.register(planner);
  registry.register(lyrics);
  registry.register(prompt);
  registry.register(music);
  registry.register(artwork);
  registry.register(metadata);

  return {
    registry,
    dispatcher:
      new AgentJobDispatcher(registry),
    engine:
      new WorkflowEngine(),
  };
}

export function createSongWorkflow(
  runtime: SongWorkflowRuntime,
  request: SongWorkflowRequest,
): Workflow {
  const workflowId =
    `song-${crypto.randomUUID()}`;

  const workflowName =
    `song-generation-${crypto.randomUUID()}`;

  const context: WorkflowContext = {
    metadata: {
      [STATE_KEY]: {
        request,
      } satisfies SongWorkflowState,
    },
  };

  const steps: WorkflowStep[] = [
    {
      id: "planner",
      name: "Plan song",
      dependsOn: [],
      timeoutMs: 30000,
      retries: 0,
      metadata: {},
      handler: async (
        stepContext,
      ) => {
        const state =
          getState(stepContext);

        const plan =
          await runtime.dispatcher.dispatch(
            "planner-agent",
            createJob<
              SongRequest,
              WorkflowPlan
            >(
              "song-planner",
              "planner.generate",
              state.request,
            ),
          );

        state.plan = plan;

        return plan;
      },
    },
    {
      id: "lyrics",
      name: "Generate lyrics",
      dependsOn: ["planner"],
      timeoutMs: 30000,
      retries: 0,
      metadata: {},
      handler: async (
        stepContext,
      ) => {
        const state =
          getState(stepContext);

        const result =
          await runtime.dispatcher.dispatch(
            "lyrics-agent",
            createJob<
              LyricsRequest,
              LyricsResult
            >(
              "song-lyrics",
              "lyrics.generate",
              {
                title:
                  state.request.title,
                genre:
                  state.request.genre,
                mood:
                  state.request.mood,
                theme:
                  state.request.theme,
              },
            ),
          );

        state.lyrics =
          result;

        return result;
      },
    },
    {
      id: "prompts",
      name: "Generate prompts",
      dependsOn: ["lyrics"],
      timeoutMs: 30000,
      retries: 0,
      metadata: {},
      handler: async (
        stepContext,
      ) => {
        const state =
          getState(stepContext);

        if (!state.lyrics) {
          throw new Error(
            "Lyrics result is missing.",
          );
        }

        const result =
          await runtime.dispatcher.dispatch(
            "prompt-agent",
            createJob<
              PromptRequest,
              PromptResult
            >(
              "song-prompts",
              "prompt.generate",
              {
                title:
                  state.request.title,
                genre:
                  state.request.genre,
                mood:
                  state.request.mood,
                theme:
                  state.request.theme,
                lyrics:
                  state.lyrics.lyrics,
              },
            ),
          );

        state.prompts =
          result;

        return result;
      },
    },
    {
      id: "music",
      name: "Generate music",
      dependsOn: ["prompts"],
      timeoutMs: 30000,
      retries: 0,
      metadata: {},
      handler: async (
        stepContext,
      ) => {
        const state =
          getState(stepContext);

        if (!state.prompts) {
          throw new Error(
            "Prompt result is missing.",
          );
        }

        const result =
          await runtime.dispatcher.dispatch(
            "music-agent",
            createJob<
              MusicGeneratorRequest,
              MusicGenerationResult
            >(
              "song-music",
              "music.generate",
              {
                prompt:
                  state.prompts.musicPrompt,
              },
            ),
          );

        state.music =
          result;

        return result;
      },
    },
    {
      id: "artwork",
      name: "Generate artwork",
      dependsOn: ["prompts"],
      timeoutMs: 30000,
      retries: 0,
      metadata: {},
      handler: async (
        stepContext,
      ) => {
        const state =
          getState(stepContext);

        if (!state.prompts) {
          throw new Error(
            "Prompt result is missing.",
          );
        }

        const result =
          await runtime.dispatcher.dispatch(
            "artwork-agent",
            createJob<
              ArtworkGeneratorRequest,
              ArtworkGenerationResult
            >(
              "song-artwork",
              "artwork.generate",
              {
                prompt:
                  state.prompts.artworkPrompt,
              },
            ),
          );

        state.artwork =
          result;

        return result;
      },
    },
    {
      id: "metadata",
      name: "Generate metadata",
      dependsOn: ["lyrics"],
      timeoutMs: 30000,
      retries: 0,
      metadata: {},
      handler: async (
        stepContext,
      ) => {
        const state =
          getState(stepContext);

        if (!state.lyrics) {
          throw new Error(
            "Lyrics result is missing.",
          );
        }

        const result =
          await runtime.dispatcher.dispatch(
            "metadata-agent",
            createJob<
              MetadataGeneratorRequest,
              MetadataGenerationResult
            >(
              "song-metadata",
              "metadata.generate",
              {
                title:
                  state.request.title,
                genre:
                  state.request.genre,
                mood:
                  state.request.mood,
                theme:
                  state.request.theme,
                lyrics:
                  state.lyrics.lyrics,
              },
            ),
          );

        state.metadata =
          result;

        return result;
      },
    },
    {
      id: "song-project",
      name: "Assemble SongProject",
      dependsOn: [
        "music",
        "artwork",
        "metadata",
      ],
      timeoutMs: 30000,
      retries: 0,
      metadata: {},
      handler: async (
        stepContext,
      ) => {
        const state =
          getState(stepContext);

        if (
          !state.lyrics ||
          !state.prompts ||
          !state.music ||
          !state.artwork ||
          !state.metadata
        ) {
          throw new Error(
            "Song workflow is missing required generation results.",
          );
        }

        const now =
          new Date();

        const project: SongProject = {
          id: workflowId,
          createdAt: now,
          updatedAt: now,
          title:
            state.request.title,
          genre:
            state.request.genre,
          mood:
            state.request.mood,
          theme:
            state.request.theme,
          lyrics:
            state.lyrics.lyrics,
          musicPrompt:
            state.prompts.musicPrompt,
          artworkPrompt:
            state.prompts.artworkPrompt,
          metadata:
            state.metadata.metadata,
        };

        state.project =
          project;

        return project;
      },
    },
  ];

  return new Workflow({
    id: workflowId,
    name: workflowName,
    context,
    steps,
  });
}

export function getSongProject(
  workflow: Workflow,
): SongProject {
  const state =
    getState(workflow.context);

  if (!state.project) {
    throw new Error(
      "SongProject has not been created.",
    );
  }

  return state.project;
}
