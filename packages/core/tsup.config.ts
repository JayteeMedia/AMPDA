import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],

  tsconfig: "./tsconfig.json",

  format: ["esm", "cjs"],

  dts: false,

  sourcemap: true,

  clean: true,

  splitting: false,

  treeshake: true,

  target: "es2022",
});
