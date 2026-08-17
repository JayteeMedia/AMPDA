import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { Generator } from "./Generator.js";
import { TemplateEngine } from "./TemplateEngine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// tools/package-generator/src
//                ▲
//                └── current directory

const generatorRoot = join(__dirname, "..");
const repositoryRoot = join(generatorRoot, "..", "..");

export class ServiceGenerator extends Generator {
  private readonly engine = new TemplateEngine();

  async generate(
    name: string,
    _root: string,
  ): Promise<void> {
    const template = join(
      generatorRoot,
      "templates",
      "service",
      "service.ts.tpl",
    );

    const destination = join(
      repositoryRoot,
      "apps",
      "orchestrator",
      "src",
      "services",
      `${name}.ts`,
    );

    const output = this.engine.render(template, {
      ClassName: name,
    });

    mkdirSync(dirname(destination), {
      recursive: true,
    });

    writeFileSync(
      destination,
      output,
      "utf8",
    );

    console.log(
      `[AMPDA] Service created: ${destination}`,
    );
  }
}
