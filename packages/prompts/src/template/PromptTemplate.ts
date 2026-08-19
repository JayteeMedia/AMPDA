export type PromptVariables =
  Record<
    string,
    string | number | boolean
  >;

export class PromptTemplate {

  constructor(
    private readonly template: string,
  ) {}

  render(
    variables: PromptVariables,
  ): string {

    let output =
      this.template;

    for (const [key, value] of Object.entries(
      variables,
    )) {

      output =
        output.replaceAll(
          `{{${key}}}`,
          String(value),
        );

    }

    return output;

  }

}
