import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],

  format: ["esm", "cjs"],

  target: "es2022",

  tsconfig: "./tsconfig.json",

  dts: false,

  sourcemap: true,

  clean: true,

  splitting: false,

  treeshake: true,
});
