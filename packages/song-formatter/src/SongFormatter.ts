export interface SongFormatter {

  format(
    lyrics: string,
  ): Promise<string>;

}
