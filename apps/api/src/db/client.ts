import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databasePath = path.resolve(
  __dirname,
  "../../../../data/ampda.db",
);

console.log(
  `[DB] Opening SQLite database: ${databasePath}`,
);

const sqlite = new Database(databasePath);

sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite);
