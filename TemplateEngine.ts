@'
import { readFileSync } from "node:fs";

import { VariableResolver } from "./VariableResolver.js";

export class TemplateEngine {
  private readonly resolver =
    new VariableResolver();

  render(
    templatePath: string,
    variables: Record<string, string>,
  ): string {
    const template =
      readFileSync(templatePath, "utf8");

    return this.resolver.resolve(
      template,
      variables,
    );
  }
}
'@ | Set-Content tools\package-generator\src\TemplateEngine.ts
