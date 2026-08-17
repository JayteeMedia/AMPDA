import { cwd } from "node:process";

import { ServiceGenerator } from "./ServiceGenerator.js";

const generator = new ServiceGenerator();

await generator.generate(
  "ExampleService",
  cwd(),
);
