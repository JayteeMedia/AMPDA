const Database = require("better-sqlite3");

const songId = process.argv[2];

if (!songId) {
  throw new Error("Usage: node inspect-workflow.cjs <songId>");
}

const db =
  new Database("../../data/ampda.db");

const jobs = db.prepare(`
  SELECT
    id,
    song_id,
    type,
    status,
    attempts,
    payload,
    created_at,
    updated_at
  FROM workflow_jobs
  WHERE song_id = ?
  ORDER BY created_at ASC
`).all(songId);

console.log(
  JSON.stringify(jobs, null, 2),
);

db.close();
