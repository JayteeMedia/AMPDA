import { useEffect } from "react";

import { songService } from "../services/SongService.js";
import { useSongStore } from "../store/SongStore.js";

export function useSongs() {

  const store =
    useSongStore();

  useEffect(() => {

    let mounted = true;

    async function load() {

      store.setLoading(true);

      try {

        const songs =
          await songService.getSongs();

        if (mounted) {

          store.setSongs(
            songs,
          );

        }

      } catch (error) {

        if (mounted) {

          store.setError(

            error instanceof Error
              ? error.message
              : "Unknown error",

          );

        }

      } finally {

        if (mounted) {

          store.setLoading(
            false,
          );

        }

      }

    }

    void load();

    return () => {

      mounted = false;

    };

  }, []);

  return store;

}
