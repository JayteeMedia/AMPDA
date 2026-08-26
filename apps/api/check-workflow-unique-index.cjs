const Database = require("better-sqlite3");

const db = new Database("../../data/ampda.db");

const result = db.prepare(`
  SELECT name, sql
  FROM sqlite_master
  WHERE type = 'index'
    AND tbl_name = 'workflow_jobs'
    AND name = 'uq_workflow_jobs_song_type'
`).get();

console.log(JSON.stringify(result, null, 2));

db.close();
