export const SONG_STATUSES = [
  "draft",
  "queued",
  "planning",
  "writing",
  "production",
  "review",
  "approved",
  "release_ready",
  "distributing",
  "distributed",
  "failed",
] as const;

export type SongStatus =
  (typeof SONG_STATUSES)[number];

export const SONG_STATUS_TRANSITIONS: Record<
  SongStatus,
  readonly SongStatus[]
> = {
  draft: [
    "queued",
  ],

  queued: [
    "planning",
    "failed",
  ],

  planning: [
    "writing",
    "failed",
  ],

  writing: [
    "production",
    "failed",
  ],

  production: [
    "review",
    "failed",
  ],

  review: [
    "approved",
    "writing",
    "failed",
  ],

  approved: [
    "release_ready",
    "failed",
  ],

  release_ready: [
    "distributing",
    "failed",
  ],

  distributing: [
    "distributed",
    "failed",
  ],

  distributed: [],

  failed: [
    "queued",
  ],
};

export function isSongStatus(
  value: string,
): value is SongStatus {
  return (
    SONG_STATUSES as readonly string[]
  ).includes(value);
}

export function canTransitionSong(
  from: SongStatus,
  to: SongStatus,
): boolean {
  return SONG_STATUS_TRANSITIONS[from].includes(to);
}
