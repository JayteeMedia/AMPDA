import { db } from "./dist/db/client.js";
import { songs, workflowJobs } from "./dist/db/schema.js";
import { WorkflowJobRepository } from "./dist/workflows/repositories/WorkflowJobRepository.js";
import { eq } from "drizzle-orm";

const repository = new WorkflowJobRepository();

const songId = "song_claim_concurrency_test";
const type = "song_planning";

console.log("=== CLAIM CONCURRENCY TEST ===");

await db
  .insert(songs)
  .values({
    id: songId,
    title: "Claim Concurrency Test",
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
    source: "claim_concurrency_test",
  },
});

console.log(`Created job: ${job.id}`);

const results = await Promise.all([
  repository.claimPending(),
  repository.claimPending(),
]);

console.log("");
console.log("=== CLAIM RESULTS ===");

console.log(
  JSON.stringify(
    results,
    null,
    2,
  ),
);

const successfulClaims =
  results.filter(Boolean);

if (successfulClaims.length !== 1) {
  throw new Error(
    `FAIL: expected exactly 1 successful claim, got ${successfulClaims.length}`,
  );
}

if (
  successfulClaims[0].id !== job.id
) {
  throw new Error(
    `FAIL: wrong job claimed: ${successfulClaims[0].id}`,
  );
}

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
console.log("=== DATABASE RESULT ===");

console.log(
  JSON.stringify(
    rows,
    null,
    2,
  ),
);

if (rows.length !== 1) {
  throw new Error(
    `FAIL: expected exactly 1 job row, found ${rows.length}`,
  );
}

if (rows[0].status !== "running") {
  throw new Error(
    `FAIL: expected running status, got ${rows[0].status}`,
  );
}

if (rows[0].attempts !== 1) {
  throw new Error(
    `FAIL: expected attempts=1, got ${rows[0].attempts}`,
  );
}

console.log("");
console.log(
  "PASS: concurrent claim protection works.",
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
