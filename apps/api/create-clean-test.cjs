const Database = require("better-sqlite3");

const db = new Database("../../data/ampda.db");

const songId =
  `song_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const now = new Date().toISOString();

db.prepare(`
  INSERT INTO songs (
    id,
    title,
    genre,
    mood,
    theme,
    status,
    created_at,
    updated_at
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  songId,
  "AMPDA Clean Pipeline Test",
  "Hip-Hop",
  "Dark",
  "Building something permanent",
  "queued",
  now,
  now
);

console.log(JSON.stringify({
  songId,
  status: "queued"
}, null, 2));

db.close();
