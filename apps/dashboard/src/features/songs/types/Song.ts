export type SongStatus =

  | "Draft"
  | "Queued"
  | "Planning"
  | "Writing Lyrics"
  | "Generating Music"
  | "Generating Artwork"
  | "Mixing"
  | "Mastering"
  | "Review"
  | "Completed"
  | "Released"
  | "Failed";

export interface Song {

  id: string;

  title: string;

  artist: string;

  genre: string;

  subgenre: string;

  mood: string;

  theme: string;

  bpm: number;

  key: string;

  duration: string;

  workflowId?: string;

  artworkId?: string;

  releaseId?: string;

  status: SongStatus;

  createdAt: string;

  updatedAt: string;

}
