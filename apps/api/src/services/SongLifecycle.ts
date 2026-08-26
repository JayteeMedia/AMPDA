import {
  songStatuses,
  type SongStatus,
} from "../db/schema.js";

const transitions: Record<
  SongStatus,
  readonly SongStatus[]
> = {
  queued: [
    "planning",
  ],

  planning: [
    "writing",
  ],

  writing: [
    "production",
  ],

  production: [
    "review",
  ],

  review: [
    "approved",
    "rejected",
  ],

  approved: [
    "release",
  ],

  rejected: [
    "planning",
  ],

  release: [],
};

export function isSongStatus(
  value: string,
): value is SongStatus {
  return (
    songStatuses as readonly string[]
  ).includes(value);
}

export function canTransitionSong(
  from: SongStatus,
  to: SongStatus,
): boolean {
  return transitions[from].includes(to);
}

export function getAllowedTransitions(
  status: SongStatus,
): readonly SongStatus[] {
  return transitions[status];
}

export class InvalidSongTransitionError
  extends Error {

  constructor(
    public readonly from: SongStatus,
    public readonly to: SongStatus,
  ) {
    super(
      `Invalid song status transition: ${from} -> ${to}`,
    );

    this.name =
      "InvalidSongTransitionError";
  }
}
