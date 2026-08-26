const Database = require("better-sqlite3");

const db = new Database("./../../data/ampda.db");

const songId = "song_1787498197686_e2e";
const type = "song_planning";

const existing = db.prepare(`
  SELECT *
  FROM workflow_jobs
  WHERE song_id = ?
    AND type = ?
`).get(songId, type);

if (existing) {
  console.log("Existing planning job:");
  console.log(existing);
  db.close();
  process.exit(0);
}

const now = new Date().toISOString();

const jobId =
  `job_${Date.now()}_e2e`;

db.prepare(`
  INSERT INTO workflow_jobs (
    id,
    song_id,
    type,
    status,
    payload,
    attempts,
    created_at,
    updated_at
  )
  VALUES (
    @id,
    @songId,
    @type,
    'pending',
    @payload,
    0,
    @createdAt,
    @updatedAt
  )
`).run({
  id: jobId,
  songId,
  type,
  payload: JSON.stringify({
    source: "e2e_test",
    status: "queued",
  }),
  createdAt: now,
  updatedAt: now,
});

console.log("Created planning job:");
console.log(jobId);

db.close();
