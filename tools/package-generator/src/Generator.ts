export abstract class Generator {

  abstract generate(
    name: string,
    root: string,
  ): Promise<void>;

}
