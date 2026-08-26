const Database = require("better-sqlite3");

const db = new Database("./../../data/ampda.db");

const rows = db.prepare(`
  SELECT
    s.id,
    s.title,
    s.status AS song_status,
    w.id AS job_id,
    w.type AS job_type,
    w.status AS job_status,
    w.attempts
  FROM songs s
  LEFT JOIN workflow_jobs w
    ON w.song_id = s.id
  ORDER BY s.created_at DESC
`).all();

console.table(rows);

db.close();
