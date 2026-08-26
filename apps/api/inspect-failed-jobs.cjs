const Database = require("better-sqlite3");

const db = new Database("./../../data/ampda.db");

const rows = db.prepare(`
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
  WHERE status = 'failed'
  ORDER BY created_at DESC
`).all();

console.table(rows);

db.close();
