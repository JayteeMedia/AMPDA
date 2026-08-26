import {
  JobQueue,
  JobPriority,
  JobStatus,
  JobExecutor,
  JobEventBus,
  type Job,
  type JobEventType,
} from "./index.js";

function createJob(
  id: string,
  priority: JobPriority,
): Job {
  return {
    id,
    name: id,
    payload: {
      id,
    },
    priority,
    status: JobStatus.Pending,
    context: {
      tags: [],
      metadata: {},
    },
    metadata: {},
    createdAt: new Date(),
  };
}

async function testPriorityQueue(): Promise<void> {
  const queue = new JobQueue();

  queue.enqueue(
    createJob(
      "normal-1",
      JobPriority.Normal,
    ),
  );

  queue.enqueue(
    createJob(
      "critical-1",
      JobPriority.Critical,
    ),
  );

  queue.enqueue(
    createJob(
      "low-1",
      JobPriority.Low,
    ),
  );

  queue.enqueue(
    createJob(
      "high-1",
      JobPriority.High,
    ),
  );

  queue.enqueue(
    createJob(
      "critical-2",
      JobPriority.Critical,
    ),
  );

  const order: string[] = [];

  while (!queue.isEmpty()) {
    const job = queue.dequeue();

    if (job) {
      order.push(job.id);
    }
  }

  const expected = [
    "critical-1",
    "critical-2",
    "high-1",
    "normal-1",
    "low-1",
  ];

  if (
    JSON.stringify(order) !==
    JSON.stringify(expected)
  ) {
    throw new Error(
      `Priority queue failed. Expected ${expected.join(", ")}, got ${order.join(", ")}.`,
    );
  }
}

async function testSuccessfulExecution(): Promise<void> {
  const events = new JobEventBus();

  const received: JobEventType[] = [];

  events.subscribe(
    "job.started",
    event => {
      received.push(event.type);
    },
  );

  events.subscribe(
    "job.completed",
    event => {
      received.push(event.type);
    },
  );

  const job = createJob(
    "event-job",
    JobPriority.Normal,
  );

  const executor = new JobExecutor(events);

  const result = await executor.execute(
    job,
    async currentJob => {
      if (currentJob.id !== "event-job") {
        throw new Error(
          "Incorrect job received.",
        );
      }

      return "success";
    },
  );

  if (!result.success) {
    throw new Error(
      "Expected successful execution.",
    );
  }

  if (
    job.status !==
    JobStatus.Completed
  ) {
    throw new Error(
      "Job did not reach completed state.",
    );
  }

  const expected = [
    "job.started",
    "job.completed",
  ];

  if (
    JSON.stringify(received) !==
    JSON.stringify(expected)
  ) {
    throw new Error(
      `Unexpected events: ${received.join(", ")}`,
    );
  }
}

async function testFailureEvent(): Promise<void> {
  const events = new JobEventBus();

  let failed = false;

  events.subscribe(
    "job.failed",
    event => {
      failed = true;

      if (!event.job.error) {
        throw new Error(
          "Failed event did not contain job error.",
        );
      }
    },
  );

  const executor = new JobExecutor(events);

  const job = createJob(
    "failure-job",
    JobPriority.Normal,
  );

  const result = await executor.execute(
    job,
    async () => {
      throw new Error(
        "Intentional test failure.",
      );
    },
  );

  if (result.success) {
    throw new Error(
      "Failure job unexpectedly succeeded.",
    );
  }

  if (!failed) {
    throw new Error(
      "Failed event was not emitted.",
    );
  }

  if (
    job.status !==
    JobStatus.Failed
  ) {
    throw new Error(
      "Job did not reach failed state.",
    );
  }
}

async function testCancellation(): Promise<void> {
  const events = new JobEventBus();

  let cancelled = false;

  events.subscribe(
    "job.cancelled",
    event => {
      cancelled = true;

      if (
        event.job.status !==
        JobStatus.Cancelled
      ) {
        throw new Error(
          "Cancelled event contained incorrect job status.",
        );
      }

      if (!event.error) {
        throw new Error(
          "Cancelled event did not contain an error.",
        );
      }

      if (!event.result) {
        throw new Error(
          "Cancelled event did not contain a JobResult.",
        );
      }
    },
  );

  const executor = new JobExecutor(events);

  const job = createJob(
    "cancelled-job",
    JobPriority.Normal,
  );

  job.status = JobStatus.Cancelled;

  const result = await executor.execute(
    job,
    async () => {
      throw new Error(
        "Cancelled job must not execute.",
      );
    },
  );

  if (result.success) {
    throw new Error(
      "Cancelled job unexpectedly succeeded.",
    );
  }

  if (!cancelled) {
    throw new Error(
      "Cancelled event was not emitted.",
    );
  }

  if (
    job.status !==
    JobStatus.Cancelled
  ) {
    throw new Error(
      "Cancelled job status changed unexpectedly.",
    );
  }
}

async function main(): Promise<void> {
  await testPriorityQueue();
  await testSuccessfulExecution();
  await testFailureEvent();
  await testCancellation();

  console.log(
    "JOB ENGINE TESTS: PASS",
  );
}

main().catch(error => {
  console.error(
    "JOB ENGINE TESTS: FAIL",
  );

  console.error(error);

  process.exitCode = 1;
});
