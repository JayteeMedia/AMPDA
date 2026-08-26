import {
  Job,
  JobStatus,
  JobPriority,
  JobEventType,
  JobEventBus,
  JobExecutor,
  JobService,
} from "./index.js";

function createJob<TPayload, TResult>(
  id: string,
  name: string,
  payload: TPayload,
): Job<TPayload, TResult> {
  return {
    id,
    name,
    payload,
    status: JobStatus.Pending,
    priority: JobPriority.Normal,
    context: {
      tags: [],
      metadata: {},
    },
    metadata: {},
    createdAt: new Date(),
  };
}

async function testSuccessfulLifecycle(): Promise<void> {
  console.log("");
  console.log("=== TEST 1: SUCCESSFUL JOB LIFECYCLE ===");

  const events = new JobEventBus();
  const service = new JobService(
    undefined,
    undefined,
    new JobExecutor({ events }),
  );

  const received: JobEventType[] = [];

  for (const type of [
    JobEventType.Started,
    JobEventType.Completed,
    JobEventType.Failed,
  ]) {
    events.subscribe(type, async (event) => {
      received.push(event.type);

      if (!event.metadata) {
        throw new Error(
          `Missing metadata for ${event.type}`,
        );
      }
    });
  }

  service.registerHandler(
    "test.success",
    async (job) => {
      return {
        message: "success",
        input: job.payload,
      };
    },
  );

  const job = createJob<
    { value: number },
    { message: string; input: { value: number } }
  >(
    "integration-success-001",
    "test.success",
    { value: 42 },
  );

  service.enqueue(job);

  const result = await service.processNext();

  if (!result) {
    throw new Error("Expected a job result.");
  }

  if (!result.success) {
    const errorMessage =
      result.error?.message ??
      "Unknown job execution error.";

    throw new Error(
      `Expected success but received failure: ${errorMessage}`,
    );
  }

  if (job.status !== JobStatus.Completed) {
    throw new Error(
      `Expected Completed status, received ${job.status}`,
    );
  }

  const expected = [
    JobEventType.Started,
    JobEventType.Completed,
  ];

  if (
    JSON.stringify(received) !==
    JSON.stringify(expected)
  ) {
    throw new Error(
      `Unexpected event sequence: ${received.join(" -> ")}`,
    );
  }

  console.log(
    "PASS: Job reached Completed state.",
  );

  console.log(
    `PASS: Event sequence = ${received.join(" -> ")}`,
  );
}

async function testFailedLifecycle(): Promise<void> {
  console.log("");
  console.log("=== TEST 2: FAILED JOB LIFECYCLE ===");

  const events = new JobEventBus();
  const service = new JobService(
    undefined,
    undefined,
    new JobExecutor({ events }),
  );

  const received: JobEventType[] = [];

  events.subscribe(
    JobEventType.Started,
    async (event) => {
      received.push(event.type);
    },
  );

  events.subscribe(
    JobEventType.Failed,
    async (event) => {
      received.push(event.type);

      if (!event.error) {
        throw new Error(
          "Failed event did not contain an error.",
        );
      }

      if (!event.result) {
        throw new Error(
          "Failed event did not contain a JobResult.",
        );
      }
    },
  );

  service.registerHandler(
    "test.failure",
    async () => {
      throw new Error("Intentional integration failure.");
    },
  );

  const job = createJob<
    Record<string, never>,
    never
  >(
    "integration-failure-001",
    "test.failure",
    {},
  );

  service.enqueue(job);

  const result = await service.processNext();

  if (!result) {
    throw new Error("Expected a job result.");
  }

  if (result.success) {
    throw new Error(
      "Expected job execution to fail.",
    );
  }

  if (job.status !== JobStatus.Failed) {
    throw new Error(
      `Expected Failed status, received ${job.status}`,
    );
  }

  const expected = [
    JobEventType.Started,
    JobEventType.Failed,
  ];

  if (
    JSON.stringify(received) !==
    JSON.stringify(expected)
  ) {
    throw new Error(
      `Unexpected event sequence: ${received.join(" -> ")}`,
    );
  }

  console.log(
    "PASS: Job reached Failed state.",
  );

  console.log(
    `PASS: Event sequence = ${received.join(" -> ")}`,
  );
}

async function testListenerIsolation(): Promise<void> {
  console.log("");
  console.log("=== TEST 3: EVENT LISTENER FAILURE ISOLATION ===");

  const events = new JobEventBus();
  const service = new JobService(
    undefined,
    undefined,
    new JobExecutor({ events }),
  );

  let healthyListenerCalled = false;

  events.subscribe(
    JobEventType.Completed,
    async () => {
      throw new Error(
        "Intentional listener failure.",
      );
    },
  );

  events.subscribe(
    JobEventType.Completed,
    async () => {
      healthyListenerCalled = true;
    },
  );

  service.registerHandler(
    "test.listener-isolation",
    async () => {
      return "completed";
    },
  );

  const job = createJob<
    Record<string, never>,
    string
  >(
    "integration-listener-001",
    "test.listener-isolation",
    {},
  );

  service.enqueue(job);

  let failed = false;

  try {
    await service.processNext();
  } catch {
    failed = true;
  }

  if (failed) {
    throw new Error(
      "Event listener failure broke job execution.",
    );
  }

  if (job.status !== JobStatus.Completed) {
    throw new Error(
      `Expected Completed status, received ${job.status}`,
    );
  }

  if (!healthyListenerCalled) {
    throw new Error(
      "Healthy event listener was not called.",
    );
  }

  console.log(
    "PASS: Listener failure did not corrupt execution.",
  );

  console.log(
    "PASS: Healthy listener still executed.",
  );
}

async function main(): Promise<void> {
  await testSuccessfulLifecycle();
  await testFailedLifecycle();
  await testListenerIsolation();

  console.log("");
  console.log("=========================================");
  console.log(
    "AMPDA JOB EVENT INTEGRATION: PASS",
  );
  console.log("=========================================");
}

main().catch((error) => {
  console.error("");
  console.error(
    "AMPDA JOB EVENT INTEGRATION: FAIL",
  );
  console.error(error);

  process.exitCode = 1;
});








