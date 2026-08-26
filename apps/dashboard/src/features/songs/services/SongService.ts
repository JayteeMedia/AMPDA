import { songApi } from "../api/SongApi.js";

export class SongService {

  getSongs() {

    return songApi.getSongs();

  }

  getSong(
    id: string,
  ) {

    return songApi.getSong(id);

  }

  createSong(
    request: Parameters<
      typeof songApi.createSong
    >[0],
  ) {

    return songApi.createSong(
      request,
    );

  }

}

export const songService =
  new SongService();
