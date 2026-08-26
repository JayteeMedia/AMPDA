import { SongAssetManager } from "./dist/services/SongAssetManager.js";

try {
  console.log("=== ASSET MANAGER TEST ===");
  console.log("CWD:", process.cwd());

  const manager = new SongAssetManager();

  const result = await manager.writeText(
    "asset_test",
    "plan",
    "test.json",
    JSON.stringify(
      {
        test: true,
        system: "AMPDA",
        timestamp: new Date().toISOString()
      },
      null,
      2
    )
  );

  console.log("=== ASSET WRITE SUCCESS ===");
  console.log(JSON.stringify(result, null, 2));

} catch (error) {
  console.error("=== ASSET WRITE FAILED ===");
  console.error(error);
  process.exitCode = 1;
}
