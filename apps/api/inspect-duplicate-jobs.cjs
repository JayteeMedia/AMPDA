const Database = require("better-sqlite3");

const db = new Database("../../data/ampda.db");

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
  WHERE song_id IN (
    'song_1787427000455_yslid6',
    'song_1787429388515_0syhuc'
  )
  ORDER BY song_id, type, created_at
`).all();

console.log(JSON.stringify(rows, null, 2));

db.close();
