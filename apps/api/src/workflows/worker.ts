import {
  WorkflowJobRepository,
} from "./repositories/WorkflowJobRepository.js";

import {
  WorkflowService,
} from "./services/WorkflowService.js";

import {
  WorkflowWorker,
} from "./workers/WorkflowWorker.js";

const repository =
  new WorkflowJobRepository();

const workflowService =
  new WorkflowService(
    repository,
  );

const worker =
  new WorkflowWorker(
    repository,
    {
      maxJobsPerRun: 10,
      workflowService,
    },
  );

console.log(
  "[AMPDA Worker] Starting...",
);

try {

  const processed =
    await worker.processAll();

  console.log(
    `[AMPDA Worker] Processed ${processed} job(s).`,
  );

} catch (error) {

  console.error(
    "[AMPDA Worker] Execution failed:",
    error,
  );

  process.exitCode = 1;
}
