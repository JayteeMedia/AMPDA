import type {
  SongMetadata,
} from "./SongMetadata.js";

export interface SongProject {

  id: string;

  createdAt: Date;

  updatedAt: Date;

  title: string;

  genre: string;

  mood: string;

  theme: string;

  artist?: string;

  album?: string;

  lyrics?: string;

  musicPrompt?: string;

  artworkPrompt?: string;

  metadata?: SongMetadata;

}
