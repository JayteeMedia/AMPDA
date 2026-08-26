import fs from "node:fs/promises";
import path from "node:path";

export type SongAssetType =
  | "plan"
  | "lyrics"
  | "production"
  | "artwork"
  | "audio"
  | "metadata"
  | "export";

export type SongAssetWriteResult = {
  songId: string;
  type: SongAssetType | string;
  filename: string;
  absolutePath: string;
};

export class SongAssetManager {

  constructor(
    private readonly rootDirectory: string =
      path.resolve(
        process.cwd(),
        "../../data/assets",
      ),
  ) {}

  async ensureSongDirectory(
    songId: string,
  ): Promise<string> {

    const directory =
      path.join(
        this.rootDirectory,
        "songs",
        songId,
      );

    await fs.mkdir(
      directory,
      {
        recursive: true,
      },
    );

    return directory;
  }

  async writeText(
    songId: string,
    type: SongAssetType | string,
    filename: string,
    content: string,
  ): Promise<SongAssetWriteResult> {

    const directory =
      await this.ensureSongDirectory(
        songId,
      );

    const absolutePath =
      path.join(
        directory,
        filename,
      );

    await fs.writeFile(
      absolutePath,
      content,
      "utf8",
    );

    return {
      songId,
      type,
      filename,
      absolutePath,
    };
  }

  async readText(
    songId: string,
    filename: string,
  ): Promise<string> {

    const directory =
      await this.ensureSongDirectory(
        songId,
      );

    const absolutePath =
      path.join(
        directory,
        filename,
      );

    return fs.readFile(
      absolutePath,
      "utf8",
    );
  }

  async exists(
    songId: string,
    filename: string,
  ): Promise<boolean> {

    const directory =
      path.join(
        this.rootDirectory,
        "songs",
        songId,
      );

    const absolutePath =
      path.join(
        directory,
        filename,
      );

    try {

      await fs.access(
        absolutePath,
      );

      return true;

    } catch {

      return false;
    }
  }

  getRootDirectory(): string {
    return this.rootDirectory;
  }
}
