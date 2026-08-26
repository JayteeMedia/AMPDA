const Database = require("better-sqlite3");

const db = new Database("./../../data/ampda.db");

const columns = db.prepare(`
  PRAGMA table_info(workflow_jobs)
`).all();

console.table(columns);

db.close();
