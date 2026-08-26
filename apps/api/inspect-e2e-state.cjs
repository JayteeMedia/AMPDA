const Database = require("better-sqlite3");

const db = new Database("./../../data/ampda.db");

const songId = "song_1787498197686_e2e";

console.table(
  db.prepare(`
    SELECT
      id,
      title,
      status,
      updated_at
    FROM songs
    WHERE id = ?
  `).all(songId)
);

console.log("=== STATUS HISTORY ===");

console.table(
  db.prepare(`
    SELECT
      from_status,
      to_status,
      reason,
      created_at
    FROM song_status_history
    WHERE song_id = ?
    ORDER BY created_at ASC
  `).all(songId)
);

console.log("=== JOBS ===");

console.table(
  db.prepare(`
    SELECT
      id,
      type,
      status,
      attempts,
      payload
    FROM workflow_jobs
    WHERE song_id = ?
    ORDER BY created_at ASC
  `).all(songId)
);

db.close();
