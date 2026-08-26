import type { Job } from "@ampda/job-engine";

import {
  AgentCapability,
  AgentJobDispatcher,
  AgentRegistry,
  AgentStatus,
  LyricsAgent,
  StubLyricsProvider,
  type LyricsRequest,
  type LyricsResult,
} from "./index.js";

import {
  JobPriority,
  JobStatus,
} from "@ampda/job-engine";

function createJob(): Job<
  LyricsRequest,
  LyricsResult
> {
  return {
    id: "lyrics-integration-001",
    name: "lyrics.generate",
    payload: {
      title: "Back Where I Started",
      genre: "Hip Hop",
      mood: "Dark",
      theme: "Returning to where the journey began.",
    },
    priority: JobPriority.Normal,
    status: JobStatus.Pending,
    context: {
      tags: ["integration", "lyrics"],
      metadata: {},
    },
    metadata: {},
    createdAt: new Date(),
  };
}

async function main(): Promise<void> {
  console.log("");
  console.log("=========================================");
  console.log("AMPDA LYRICS AGENT INTEGRATION");
  console.log("=========================================");

  const provider =
    new StubLyricsProvider();

  const agent =
    new LyricsAgent(
      {
        id: "lyrics-agent",
        name: "Lyrics Agent",
        capabilities: [
          AgentCapability.Lyrics,
        ],
        metadata: {},
      },
      provider,
    );

  const registry =
    new AgentRegistry();

  registry.register(agent);

  if (!registry.has("lyrics-agent")) {
    throw new Error(
      "Lyrics agent was not registered.",
    );
  }

  const dispatcher =
    new AgentJobDispatcher(
      registry,
    );

  const result =
    await dispatcher.dispatch(
      "lyrics-agent",
      createJob(),
    );

  if (agent.status !== AgentStatus.Running) {
    throw new Error(
      `Expected agent to be Running, received ${agent.status}`,
    );
  }

  if (!result) {
    throw new Error(
      "Lyrics agent returned no result.",
    );
  }

  if (!result.lyrics) {
    throw new Error(
      "Lyrics result contains no lyrics.",
    );
  }

  if (
    !result.lyrics.includes(
      "Back Where I Started",
    )
  ) {
    throw new Error(
      "Lyrics result does not contain the requested title.",
    );
  }

  if (
    !result.lyrics.includes("Hip Hop")
  ) {
    throw new Error(
      "Lyrics result does not contain the requested genre.",
    );
  }

  if (
    !result.lyrics.includes(
      "Returning to where the journey began.",
    )
  ) {
    throw new Error(
      "Lyrics result does not contain the requested theme.",
    );
  }

  console.log("");
  console.log("PASS: Lyrics agent registered.");
  console.log("PASS: Dispatcher resolved lyrics agent.");
  console.log("PASS: Agent transitioned Idle -> Running.");
  console.log("PASS: LyricsAgent executed successfully.");
  console.log("PASS: Lyrics result returned.");
  console.log("PASS: Generated lyrics contain title.");
  console.log("PASS: Generated lyrics contain genre.");
  console.log("PASS: Generated lyrics contain theme.");

  console.log("");
  console.log("=========================================");
  console.log("LYRICS AGENT INTEGRATION: PASS");
  console.log("=========================================");
}

main().catch((error) => {
  console.error("");
  console.error(
    "LYRICS AGENT INTEGRATION: FAIL",
  );
  console.error(error);
  process.exitCode = 1;
});
