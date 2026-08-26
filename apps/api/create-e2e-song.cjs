const Database = require("better-sqlite3");

const db = new Database("./../../data/ampda.db");

const songId =
  `song_${Date.now()}_e2e`;

const now =
  new Date().toISOString();

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
  VALUES (
    @id,
    @title,
    @genre,
    @mood,
    @theme,
    @status,
    @createdAt,
    @updatedAt
  )
`).run({
  id: songId,
  title: "AMPDA E2E Pipeline Verification",
  genre: "Hip Hop",
  mood: "Focused",
  theme: "Autonomous workflow verification",
  status: "queued",
  createdAt: now,
  updatedAt: now,
});

console.log("Created test song:");
console.log(songId);

db.close();
