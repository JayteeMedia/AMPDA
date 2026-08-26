import {
  sqliteTable,
  text,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const songStatuses = [
  "queued",
  "planning",
  "writing",
  "production",
  "review",
  "approved",
  "rejected",
  "release",
] as const;

export type SongStatus =
  (typeof songStatuses)[number];

export const songs = sqliteTable(
  "songs",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    genre: text("genre").notNull(),
    mood: text("mood").notNull(),
    theme: text("theme").notNull().default(""),
    status: text("status").notNull().default("queued"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
);

export const songStatusHistory = sqliteTable(
  "song_status_history",
  {
    id: text("id").primaryKey(),

    songId: text("song_id")
      .notNull()
      .references(() => songs.id, {
        onDelete: "cascade",
      }),

    fromStatus: text("from_status"),
    toStatus: text("to_status").notNull(),

    reason: text("reason")
      .notNull()
      .default(""),

    createdAt: text("created_at").notNull(),
  },
  (table) => ({
    songIdIndex: index(
      "idx_song_status_history_song_id",
    ).on(table.songId),

    createdAtIndex: index(
      "idx_song_status_history_created_at",
    ).on(table.createdAt),
  }),
);

export const workflowJobs = sqliteTable(
  "workflow_jobs",
  {
    id: text("id").primaryKey(),

    songId: text("song_id")
      .notNull()
      .references(() => songs.id, {
        onDelete: "cascade",
      }),

    type: text("type").notNull(),
    status: text("status").notNull().default("pending"),

    payload: text("payload")
      .notNull()
      .default("{}"),

    attempts: integer("attempts")
      .notNull()
      .default(0),

    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    songIdIndex: index(
      "idx_workflow_jobs_song_id",
    ).on(table.songId),

    statusIndex: index(
      "idx_workflow_jobs_status",
    ).on(table.status),

    createdAtIndex: index(
      "idx_workflow_jobs_created_at",
    ).on(table.createdAt),

    songTypeUnique: uniqueIndex(
      "uq_workflow_jobs_song_type",
    ).on(
      table.songId,
      table.type,
    ),
  }),
);

export const songPlans = sqliteTable(
  "song_plans",
  {
    id: text("id").primaryKey(),

    songId: text("song_id")
      .notNull()
      .references(() => songs.id, {
        onDelete: "cascade",
      }),

    concept: text("concept").notNull(),

    structure: text("structure")
      .notNull()
      .default("[]"),

    bpm: integer("bpm").notNull(),
    key: text("key").notNull(),
    energy: integer("energy").notNull(),

    vocalStyle: text("vocal_style").notNull(),

    productionDirection: text(
      "production_direction",
    ).notNull(),

    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    songIdIndex: index(
      "idx_song_plans_song_id",
    ).on(table.songId),

    createdAtIndex: index(
      "idx_song_plans_created_at",
    ).on(table.createdAt),
  }),
);

export const songWrites = sqliteTable(
  "song_writes",
  {
    id: text("id").primaryKey(),

    songId: text("song_id")
      .notNull()
      .references(() => songs.id, {
        onDelete: "cascade",
      }),

    lyrics: text("lyrics")
      .notNull()
      .default(""),

    structure: text("structure")
      .notNull()
      .default("[]"),

    vocalDirection: text(
      "vocal_direction",
    ).notNull(),

    writingNotes: text(
      "writing_notes",
    ).notNull(),

    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    songIdIndex: index(
      "idx_song_writes_song_id",
    ).on(table.songId),

    createdAtIndex: index(
      "idx_song_writes_created_at",
    ).on(table.createdAt),
  }),
);


