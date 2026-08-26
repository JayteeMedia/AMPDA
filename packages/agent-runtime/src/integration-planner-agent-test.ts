import type { Job } from "@ampda/job-engine";

import {
  AgentCapability,
  AgentJobDispatcher,
  AgentRegistry,
  AgentStatus,
  PlannerAgent,
} from "./index.js";

import {
  JobPriority,
  JobStatus,
} from "@ampda/job-engine";

import {
  StubPlannerProvider,
  type WorkflowPlan,
} from "@ampda/planner";

import type { SongRequest } from "./agents/PlannerAgent.js";

function createJob(): Job<
  SongRequest,
  WorkflowPlan
> {
  return {
    id: "planner-integration-001",
    name: "planner.generate",
    payload: {
      title: "Back Where I Started",
      genre: "Hip Hop",
      mood: "Dark",
      theme: "Returning to where the journey began.",
    },
    priority: JobPriority.Normal,
    status: JobStatus.Pending,
    context: {
      tags: ["integration", "planner"],
      metadata: {},
    },
    metadata: {},
    createdAt: new Date(),
  };
}

async function main(): Promise<void> {
  console.log("");
  console.log("=========================================");
  console.log("AMPDA PLANNER AGENT INTEGRATION");
  console.log("=========================================");

  const provider =
    new StubPlannerProvider();

  const agent =
    new PlannerAgent(
      {
        id: "planner-agent",
        name: "Planner Agent",
        capabilities: [
          AgentCapability.Planning,
        ],
        metadata: {},
      },
      provider,
    );

  const registry =
    new AgentRegistry();

  registry.register(agent);

  if (!registry.has("planner-agent")) {
    throw new Error(
      "Planner agent was not registered.",
    );
  }

  const dispatcher =
    new AgentJobDispatcher(
      registry,
    );

  const plan =
    await dispatcher.dispatch(
      "planner-agent",
      createJob(),
    );

  if (agent.status !== AgentStatus.Running) {
    throw new Error(
      `Expected agent to be Running, received ${agent.status}`,
    );
  }

  if (!plan) {
    throw new Error(
      "Planner returned no workflow plan.",
    );
  }

  if (
    plan.song.title !==
    "Back Where I Started"
  ) {
    throw new Error(
      `Unexpected title: ${plan.song.title}`,
    );
  }

  if (!plan.song.genre) {
    throw new Error(
      "Workflow plan missing genre.",
    );
  }

  if (
    !plan.song.bpm ||
    plan.song.bpm < 60 ||
    plan.song.bpm > 220
  ) {
    throw new Error(
      `Invalid BPM: ${plan.song.bpm}`,
    );
  }

  if (
    !Array.isArray(plan.song.structure) ||
    plan.song.structure.length === 0
  ) {
    throw new Error(
      "Workflow plan contains no structure.",
    );
  }

  if (
    !Array.isArray(
      plan.production.instrumentation,
    ) ||
    plan.production.instrumentation.length === 0
  ) {
    throw new Error(
      "Workflow plan contains no instrumentation.",
    );
  }

  console.log("");
  console.log("PASS: Planner agent registered.");
  console.log("PASS: Dispatcher resolved planner agent.");
  console.log("PASS: Agent transitioned Idle -> Running.");
  console.log("PASS: PlannerAgent executed successfully.");
  console.log("PASS: WorkflowPlan returned.");
  console.log(
    `PASS: Title = ${plan.song.title}`,
  );
  console.log(
    `PASS: BPM = ${plan.song.bpm}`,
  );
  console.log(
    `PASS: Key = ${plan.song.key}`,
  );
  console.log(
    `PASS: Structure steps = ${plan.song.structure.length}`,
  );

  console.log("");
  console.log("=========================================");
  console.log("PLANNER AGENT INTEGRATION: PASS");
  console.log("=========================================");
}

main().catch((error) => {
  console.error("");
  console.error(
    "PLANNER AGENT INTEGRATION: FAIL",
  );
  console.error(error);
  process.exitCode = 1;
});
