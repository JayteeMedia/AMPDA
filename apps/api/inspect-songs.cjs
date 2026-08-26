const Database = require("better-sqlite3");

const db = new Database("./../../data/ampda.db");

const songs = db.prepare(`
  SELECT
    id,
    title,
    status,
    created_at,
    updated_at
  FROM songs
  ORDER BY created_at DESC
`).all();

console.table(songs);

db.close();
