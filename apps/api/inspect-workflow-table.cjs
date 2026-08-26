const Database = require("better-sqlite3");

const db = new Database("../../data/ampda.db");

const columns = db.prepare(`
  PRAGMA table_info(workflow_jobs)
`).all();

console.log(JSON.stringify(columns, null, 2));

db.close();
