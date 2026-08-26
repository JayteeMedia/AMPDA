const Database = require("better-sqlite3");

const db = new Database("../../data/ampda.db");

const rows = db.prepare(`
  SELECT
    song_id,
    type,
    COUNT(*) AS count
  FROM workflow_jobs
  GROUP BY song_id, type
  HAVING COUNT(*) > 1
  ORDER BY song_id, type
`).all();

console.log(JSON.stringify(rows, null, 2));

db.close();
