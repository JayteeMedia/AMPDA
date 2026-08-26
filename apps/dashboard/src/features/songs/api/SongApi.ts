import { api } from "../../../shared/api/ApiClient.js";
import type { Song } from "../types/Song.js";

export class SongApi {

  async getSongs(): Promise<Song[]> {

    return api.get<Song[]>("/songs");

  }

  async getSong(
    id: string,
  ): Promise<Song> {

    return api.get<Song>(
      `/songs/${id}`,
    );

  }

  async createSong(
    request: Partial<Song>,
  ): Promise<Song> {

    return api.post<Song>(
      "/songs",
      request,
    );

  }

}

export const songApi =
  new SongApi();
