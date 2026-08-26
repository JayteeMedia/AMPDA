import { db } from "./dist/db/client.js";
import { songs } from "./dist/db/schema.js";
import { workflowJobs } from "./dist/db/schema.js";
import { WorkflowJobRepository } from "./dist/workflows/repositories/WorkflowJobRepository.js";
import { eq } from "drizzle-orm";

const repository =
  new WorkflowJobRepository();

const songId =
  "song_repository_idempotency_test";

const type =
  "song_planning";

console.log(
  "[DB] Starting repository idempotency test",
);

console.log(
  "=== REPOSITORY IDEMPOTENCY TEST ===",
);

await db
  .insert(songs)
  .values({
    id: songId,
    title: "Repository Idempotency Test",
    genre: "Test",
    mood: "Test",
    theme: "",
    status: "queued",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  .onConflictDoNothing();

console.log(
  "Test song exists.",
);

const first =
  await repository.create({
    songId,
    type,
    payload: {
      source:
        "repository_idempotency_test",
    },
  });

console.log(
  `First job: ${first.id}`,
);

const second =
  await repository.create({
    songId,
    type,
    payload: {
      source:
        "repository_idempotency_test_duplicate",
    },
  });

console.log(
  `Second job: ${second.id}`,
);

if (
  first.id !== second.id
) {
  throw new Error(
    `FAIL: repository created duplicate jobs: ${first.id} !== ${second.id}`,
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

if (
  jobs.length !== 1
) {
  throw new Error(
    `FAIL: expected exactly 1 workflow job, found ${jobs.length}`,
  );
}

console.log("");
console.log(
  "PASS: repository create() is idempotent.",
);

console.log(
  `Same job returned: ${first.id}`,
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
