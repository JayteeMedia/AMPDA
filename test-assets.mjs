import { SongAssetManager } from "./apps/api/dist/services/SongAssetManager.js";

const manager = new SongAssetManager();

console.log("ROOT:", manager.getRootDirectory());

const result = await manager.writeText(
  "asset_test",
  "plan",
  "test.json",
  JSON.stringify(
    {
      system: "AMPDA",
      test: true,
    },
    null,
    2,
  ),
);

console.log(
  JSON.stringify(
    result,
    null,
    2,
  ),
);
