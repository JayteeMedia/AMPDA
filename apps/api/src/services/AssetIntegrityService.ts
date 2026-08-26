import path from "node:path";

import {
  SongAssetManager,
} from "./SongAssetManager.js";

export type AssetIntegrityResult = {
  songId: string;
  filename: string;
  exists: boolean;
  restored: boolean;
  absolutePath: string;
};

export type RestoreAssetOptions = {
  songId: string;
  filename: string;
  type: string;
  content: string;
};

export class AssetIntegrityService {

  constructor(
    private readonly assetManager:
      SongAssetManager = new SongAssetManager(),
  ) {}

  async verify(
    songId: string,
    filename: string,
  ): Promise<AssetIntegrityResult> {

    const exists =
      await this.assetManager.exists(
        songId,
        filename,
      );

    const absolutePath =
      path.join(
        this.assetManager.getRootDirectory(),
        "songs",
        songId,
        filename,
      );

    return {
      songId,
      filename,
      exists,
      restored: false,
      absolutePath,
    };
  }

  async restore(
    options: RestoreAssetOptions,
  ): Promise<AssetIntegrityResult> {

    const result =
      await this.assetManager.writeText(
        options.songId,
        options.type,
        options.filename,
        options.content,
      );

    return {
      songId: options.songId,
      filename: options.filename,
      exists: true,
      restored: true,
      absolutePath: result.absolutePath,
    };
  }

  async verifyOrRestore(
    options: RestoreAssetOptions,
  ): Promise<AssetIntegrityResult> {

    const verification =
      await this.verify(
        options.songId,
        options.filename,
      );

    if (verification.exists) {
      return verification;
    }

    return this.restore(options);
  }
}
