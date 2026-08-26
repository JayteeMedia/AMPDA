import type { SongProject } from "../project/SongProject.js";
import { promises as fs } from "node:fs";
import { dirname, resolve } from "node:path";

export async function saveSongProject(
  project: SongProject,
  filePath: string,
): Promise<void> {
  const targetPath = resolve(filePath);

  await fs.mkdir(
    dirname(targetPath),
    {
      recursive: true,
    },
  );

  const json =
    JSON.stringify(
      project,
      null,
      2,
    );

  await fs.writeFile(
    targetPath,
    `${json}\n`,
    "utf8",
  );
}

export async function loadSongProject(
  filePath: string,
): Promise<SongProject> {
  const targetPath = resolve(filePath);

  const json =
    await fs.readFile(
      targetPath,
      "utf8",
    );

  const parsed: unknown =
    JSON.parse(json);

  if (
    !parsed ||
    typeof parsed !== "object"
  ) {
    throw new Error(
      "SongProject file must contain a JSON object.",
    );
  }

  return parsed as SongProject;
}
