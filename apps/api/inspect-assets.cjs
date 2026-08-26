const Database = require("better-sqlite3");

const db = new Database("../../data/ampda.db");

const songId = process.argv[2];

console.log("=== PLAN ===");

console.log(JSON.stringify(
  db.prepare(`
    SELECT *
    FROM song_plans
    WHERE song_id = ?
  `).get(songId),
  null,
  2
));

console.log("=== WRITE ===");

console.log(JSON.stringify(
  db.prepare(`
    SELECT *
    FROM song_writes
    WHERE song_id = ?
  `).get(songId),
  null,
  2
));

db.close();
