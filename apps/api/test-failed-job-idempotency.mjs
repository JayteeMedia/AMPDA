import { db } from "./dist/db/client.js";
import { songs, workflowJobs } from "./dist/db/schema.js";
import { WorkflowJobRepository } from "./dist/workflows/repositories/WorkflowJobRepository.js";
import { eq } from "drizzle-orm";

const repository =
  new WorkflowJobRepository();

const songId =
  "song_failed_idempotency_test";

const type =
  "song_writing";

console.log(
  "=== FAILED JOB IDEMPOTENCY TEST ===",
);

await db
  .insert(songs)
  .values({
    id: songId,
    title: "Failed Job Idempotency Test",
    genre: "Test",
    mood: "Test",
    theme: "",
    status: "queued",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  .onConflictDoNothing();

console.log("Test song exists.");

const first =
  await repository.create({
    songId,
    type,
    payload: {
      source: "failed_job_test",
    },
  });

console.log(
  `Created job: ${first.id}`,
);

if (first.status !== "pending") {
  throw new Error(
    `FAIL: expected pending job, got ${first.status}`,
  );
}

/*
 * Correct lifecycle:
 *
 * pending → running → failed
 *
 * claimPending() performs the pending → running transition.
 */
const claimed =
  await repository.claimPending();

if (!claimed) {
  throw new Error(
    "FAIL: pending job could not be claimed.",
  );
}

if (claimed.id !== first.id) {
  throw new Error(
    `FAIL: wrong job claimed: ${claimed.id} !== ${first.id}`,
  );
}

console.log(
  `Claimed job: ${claimed.id}`,
);

console.log(
  `Status after claim: ${claimed.status}`,
);

if (claimed.status !== "running") {
  throw new Error(
    `FAIL: expected running status, got ${claimed.status}`,
  );
}

const failed =
  await repository.markFailed(
    first.id,
    new Error(
      "Intentional test failure",
    ),
  );

console.log(
  `Failed job: ${failed.id}`,
);

console.log(
  `Status after failure: ${failed.status}`,
);

if (failed.status !== "failed") {
  throw new Error(
    `FAIL: expected failed status, got ${failed.status}`,
  );
}

/*
 * Now test the important behavior:
 *
 * create() must NOT create a second job when the
 * unique (song_id, type) job already exists in failed state.
 */
const second =
  await repository.create({
    songId,
    type,
    payload: {
      source:
        "duplicate_after_failure",
    },
  });

console.log(
  `Second create returned: ${second.id}`,
);

console.log(
  `Second job status: ${second.status}`,
);

if (first.id !== second.id) {
  throw new Error(
    `FAIL: duplicate job created after failure: ${first.id} !== ${second.id}`,
  );
}

if (second.status !== "failed") {
  throw new Error(
    `FAIL: existing failed job was not returned: ${second.status}`,
  );
}

const jobs =
  await db
    .select({
      id: workflowJobs.id,
      songId: workflowJobs.songId,
      type: workflowJobs.type,
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
console.log(
  "=== DATABASE RESULT ===",
);

console.log(
  JSON.stringify(
    jobs,
    null,
    2,
  ),
);

if (jobs.length !== 1) {
  throw new Error(
    `FAIL: expected exactly 1 workflow job, found ${jobs.length}`,
  );
}

console.log("");
console.log(
  "PASS: failed jobs remain idempotent.",
);

console.log(
  `Original job: ${first.id}`,
);

console.log(
  `Returned job: ${second.id}`,
);

console.log(
  "Exactly one database record exists.",
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
