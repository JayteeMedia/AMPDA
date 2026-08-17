import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export interface CreatePackageOptions {
  name: string;
  root: string;
}

export function createPackage({
  name,
  root,
}: CreatePackageOptions): void {
  const packageRoot = join(root, "packages", name);
  const srcRoot = join(packageRoot, "src");

  if (existsSync(packageRoot)) {
    throw new Error(`Package "${name}" already exists.`);
  }

  mkdirSync(srcRoot, { recursive: true });

  writeFileSync(
    join(srcRoot, "index.ts"),
    `export const PACKAGE_NAME = "${name}";\n`,
    "utf8",
  );

  console.log(`[AMPDA] Created package: ${packageRoot}`);
}
