import { create } from "zustand";

import type { Song } from "../types/Song.js";

export interface SongStore {

  songs: Song[];

  loading: boolean;

  error?: string;

  setSongs(
    songs: Song[],
  ): void;

  setLoading(
    loading: boolean,
  ): void;

  setError(
    error?: string,
  ): void;

}

export const useSongStore =
  create<SongStore>(

    set => ({

      songs: [],

      loading: false,

      error: undefined,

      setSongs: songs =>
        set({ songs }),

      setLoading: loading =>
        set({ loading }),

      setError: error =>
        set({ error }),

    }),

  );
