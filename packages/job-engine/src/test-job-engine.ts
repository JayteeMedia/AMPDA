import {
  Job,
  JobExecutor,
  JobPriority,
  JobQueue,
} from "./index.js";

async function main(): Promise<void> {
  const queue = new JobQueue();

  const executor = new JobExecutor();

  const job = new Job<string>({
    id: "job-001",
    name: "HelloJob",
    priority: JobPriority.Normal,
  });

  queue.enqueue(job);

  console.log("Queue Size:", queue.size());

  const next = queue.dequeue();

  if (!next) {
    throw new Error("No job available.");
  }

  const result = await executor.execute(
    next,
    async () => {
      return "AMPDA Job Engine Online";
    },
  );

  console.log("");

  console.log("Job:", next.name);
  console.log("Status:", next.status);
  console.log("Success:", result.success);
  console.log("Result:", result.data);
  console.log("Duration:", result.durationMs, "ms");
}

main().catch(console.error);
