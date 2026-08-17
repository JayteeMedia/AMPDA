import {
  JobExecutor,
  JobPriority,
  JobQueue,
  JobStatus,
  type Job,
} from "./index.js";

async function main(): Promise<void> {
  const queue = new JobQueue();

  const executor = new JobExecutor();

  const job: Job<string, string> = {
    id: "job-001",

    name: "HelloJob",

    payload: "AMPDA",

    priority: JobPriority.Normal,

    status: JobStatus.Pending,

    metadata: {},

    createdAt: new Date(),
  };

  queue.enqueue(job);

  console.log("");

  console.log("Queue Size:", queue.size());

  const next = queue.dequeue();

  if (!next) {
    throw new Error("No job available.");
  }

  const result = await executor.execute(
    next,
    async (job) => {
      return `AMPDA Job Engine Online: ${job.payload}`;
    },
  );

  console.log("");

  console.log("Job:", next.name);

  console.log("Status:", next.status);

  console.log("Success:", result.success);

  console.log("Result:", result.data);

  console.log("Duration:", result.durationMs, "ms");
}

main().catch((error) => {
  console.error(error);

  process.exit(1);
});
