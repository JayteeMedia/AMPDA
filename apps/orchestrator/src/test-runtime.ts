import {
  Job,
  JobPriority,
} from "@ampda/job-engine";

import { runtime } from "./runtime/Runtime.js";
import { jobEngine } from "./services/JobEngineService.js";

async function main(): Promise<void> {
  await runtime.start();

  const job = new Job<string>({
    id: "runtime-001",
    name: "Runtime Test",
    priority: JobPriority.Normal,
  });

  jobEngine.register(
    "Runtime Test",
    async () => "AMPDA Runtime OK",
  );

  jobEngine.submit(job);

  console.log("");
  console.log("Queue Size:", jobEngine.size());

  const result =
    await jobEngine.executeNext();

  console.log("");
  console.log("Status:", job.status);
  console.log("Success:", result?.success);
  console.log("Result:", result?.data);

  await runtime.stop();
}

main().catch(console.error);
