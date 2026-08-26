import {
  Workflow,
  WorkflowEngine,
  WorkflowState,
  type WorkflowId,
  type WorkflowStep,
} from "./index.js";

const workflowId =
  "workflow-integration-test" as WorkflowId;

let stepExecuted = false;

const step: WorkflowStep = {
  id: "step-1",
  name: "Integration Test Step",
  dependsOn: [],
  timeoutMs: 5_000,
  retries: 0,
  metadata: {},
  handler: async (context) => {
    stepExecuted = true;

    return {
      correlationId:
        context.metadata.correlationId,
    };
  },
};

const workflow = new Workflow({
  id: workflowId,
  name: "Workflow Engine Integration Test",
  context: {
    metadata: {
      correlationId: "workflow-test-correlation",
    },
  },
  steps: [step],
});

const engine = new WorkflowEngine();

engine.register(workflow);

if (!engine.has(workflow.name)) {
  throw new Error(
    "Workflow was not registered.",
  );
}

const result =
  await engine.execute(
    workflow.name,
  );

if (!result.success) {
  throw new Error(
    "Workflow execution failed.",
  );
}

if (!stepExecuted) {
  throw new Error(
    "Workflow step did not execute.",
  );
}

if (
  workflow.state !==
  WorkflowState.Completed
) {
  throw new Error(
    `Expected workflow state to be Completed, received ${workflow.state}.`,
  );
}

if (!result.steps["step-1"]?.success) {
  throw new Error(
    "Workflow step result was not successful.",
  );
}

console.log(
  "=========================================",
);
console.log(
  "WORKFLOW ENGINE INTEGRATION: PASS",
);
console.log(
  "=========================================",
);
console.log(
  `workflow: ${workflow.name}`,
);
console.log(
  `state: ${workflow.state}`,
);
console.log(
  `step: ${result.steps["step-1"]?.success ? "PASS" : "FAIL"}`,
);
