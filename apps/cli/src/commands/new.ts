export interface NewCommandOptions {
  type: string;
  name: string;
}

export async function runNewCommand(
  options: NewCommandOptions,
): Promise<void> {
  switch (options.type) {
    case "package":
      console.log(`[AMPDA] Creating package "${options.name}"...`);
      break;

    default:
      throw new Error(
        `Unknown resource type: ${options.type}`,
      );
  }
}
