const Database = require("better-sqlite3");

const db = new Database("./../../data/ampda.db");

const rows = db.prepare(`
  SELECT
    id,
    song_id,
    type,
    status,
    attempts,
    created_at,
    updated_at
  FROM workflow_jobs
  WHERE status = 'pending'
  ORDER BY created_at ASC
`).all();

console.table(rows);

db.close();
