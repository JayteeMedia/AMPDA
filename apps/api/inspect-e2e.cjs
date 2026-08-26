const Database = require("better-sqlite3");

const db = new Database("./../../data/ampda.db");

const songId = "song_1787498197686_e2e";

console.log("=== SONG ===");

console.table(
  db.prepare(`
    SELECT
      id,
      title,
      status,
      created_at,
      updated_at
    FROM songs
    WHERE id = ?
  `).all(songId)
);

console.log("=== WORKFLOW JOBS ===");

console.table(
  db.prepare(`
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
  `).all(songId)
);

db.close();
