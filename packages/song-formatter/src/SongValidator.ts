export interface SongValidator {

  validate(
    lyrics: string,
  ): Promise<void>;

}
