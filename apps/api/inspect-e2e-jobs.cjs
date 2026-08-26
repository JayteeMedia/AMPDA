const Database = require("better-sqlite3");

const db = new Database("./../../data/ampda.db");

console.table(
  db.prepare(`
    SELECT
      id,
      song_id,
      type,
      status,
      attempts,
      payload
    FROM workflow_jobs
    WHERE song_id = 'song_1787498197686_e2e'
    ORDER BY created_at ASC
  `).all()
);

db.close();
