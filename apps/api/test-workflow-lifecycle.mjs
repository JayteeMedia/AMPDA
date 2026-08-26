import { db } from "./dist/db/client.js";
import { songs, workflowJobs } from "./dist/db/schema.js";
import { WorkflowJobRepository } from "./dist/workflows/repositories/WorkflowJobRepository.js";
import { eq } from "drizzle-orm";

const repository = new WorkflowJobRepository();

const songId = "song-lifecycle_test";
const type = "song_planning";

console.log("=== WORKFLOW LIFECYCLE TEST ===");

await db
  .insert(songs)
  .values({
    id: songId,
    title: "Workflow Lifecycle Test",
    genre: "Test",
    mood: "Test",
    theme: "",
    status: "queued",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  .onConflictDoNothing();

const job = await repository.create({
  songId,
  type,
  payload: {
    source: "lifecycle_test",
  },
});

console.log(`Created: ${job.id}`);
console.log(`Initial status: ${job.status}`);

let rejected = false;

try {
  await repository.markCompleted(job.id);
} catch {
  rejected = true;
}

if (!rejected) {
  throw new Error(
    "FAIL: pending → completed should be rejected",
  );
}

console.log(
  "PASS: pending → completed rejected",
);

rejected = false;

try {
  await repository.markFailed(
    job.id,
    new Error("invalid transition test"),
  );
} catch {
  rejected = true;
}

if (!rejected) {
  throw new Error(
    "FAIL: pending → failed should be rejected",
  );
}

console.log(
  "PASS: pending → failed rejected",
);

const running =
  await repository.claimPending();

if (!running) {
  throw new Error(
    "FAIL: pending → running failed",
  );
}

console.log(
  "PASS: pending → running",
);

const completed =
  await repository.markCompleted(
    job.id,
  );

if (completed.status !== "completed") {
  throw new Error(
    `FAIL: expected completed, got ${completed.status}`,
  );
}

console.log(
  "PASS: running → completed",
);

rejected = false;

try {
  await repository.markCompleted(job.id);
} catch {
  rejected = true;
}

if (!rejected) {
  throw new Error(
    "FAIL: completed → completed should be rejected",
  );
}

console.log(
  "PASS: completed → completed rejected",
);

rejected = false;

try {
  await repository.markFailed(
    job.id,
    new Error("completed failure test"),
  );
} catch {
  rejected = true;
}

if (!rejected) {
  throw new Error(
    "FAIL: completed → failed should be rejected",
  );
}

console.log(
  "PASS: completed → failed rejected",
);

const rows = await db
  .select({
    id: workflowJobs.id,
    status: workflowJobs.status,
    attempts: workflowJobs.attempts,
  })
  .from(workflowJobs)
  .where(
    eq(
      workflowJobs.songId,
      songId,
    ),
  );

console.log("");
console.log("=== FINAL DATABASE STATE ===");

console.log(
  JSON.stringify(rows, null, 2),
);

if (rows.length !== 1) {
  throw new Error(
    `FAIL: expected 1 job, got ${rows.length}`,
  );
}

if (rows[0].status !== "completed") {
  throw new Error(
    `FAIL: final status is ${rows[0].status}`,
  );
}

console.log("");
console.log(
  "PASS: workflow lifecycle transitions are enforced.",
);

await db
  .delete(workflowJobs)
  .where(
    eq(
      workflowJobs.songId,
      songId,
    ),
  );

await db
  .delete(songs)
  .where(
    eq(
      songs.id,
      songId,
    ),
  );

console.log(
  "Test records cleaned up.",
);
