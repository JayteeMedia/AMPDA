const Database = require("better-sqlite3");

const songId = process.argv[2];

const db =
  new Database("../../data/ampda.db");

const song =
  db.prepare(`
    SELECT
      id,
      title,
      status,
      created_at,
      updated_at
    FROM songs
    WHERE id = ?
  `).get(songId);

const jobs =
  db.prepare(`
    SELECT
      id,
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
  JSON.stringify(
    {
      song,
      jobs,
    },
    null,
    2,
  ),
);

db.close();
