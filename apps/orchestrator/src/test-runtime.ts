import {
  JobPriority,
  JobStatus,
} from "@ampda/job-engine";

import { jobEngine } from "./services/JobEngineService.js";

async function main(): Promise<void> {
  jobEngine.register<
    string,
    string
  >(
    "test",
    async (job) => {
      return `Processed: ${job.payload}`;
    },
  );

  const job = {
    id: "job-1",

    name: "test",

    payload: "Hello AMPDA",

    priority: JobPriority.Normal,

    status: JobStatus.Pending,

    metadata: {},

    createdAt: new Date(),
  };

  jobEngine.submit(job);

  const result =
    await jobEngine.executeNext();

  console.log(result);
}

main().catch(console.error);
