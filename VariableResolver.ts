@'
export class VariableResolver {
  resolve(
    template: string,
    variables: Record<string, string>,
  ): string {
    let result = template;

    for (const [key, value] of Object.entries(variables)) {
      result = result.replaceAll(
        `{{${key}}}`,
        value,
      );
    }

    return result;
  }
}
'@ | Set-Content tools\package-generator\src\VariableResolver.ts
