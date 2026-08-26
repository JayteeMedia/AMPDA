import {
  WorkflowJobRepository,
} from "./src/workflows/repositories/WorkflowJobRepository.js";

import {
  WorkflowWorker,
} from "./src/workflows/workers/WorkflowWorker.js";

const repository =
  new WorkflowJobRepository();

const worker =
  new WorkflowWorker(
    repository,
  );

console.log(
  "=== AMPDA WORKFLOW WORKER TEST ===",
);

const before =
  await repository.findPending();

console.log(
  `Pending before: ${before.length}`,
);

const processed =
  await worker.processAll();

console.log(
  `Processed: ${processed}`,
);

const after =
  await repository.findPending();

console.log(
  `Pending after: ${after.length}`,
);
