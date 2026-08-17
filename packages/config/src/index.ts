import { z } from "zod";

const ConfigSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error"]).default("info"),
  OPENAI_API_KEY: z.string().optional(),
});

export type AmpdaConfig = z.infer<typeof ConfigSchema>;

export function loadConfig(): AmpdaConfig {
  return ConfigSchema.parse(process.env);
}

export const config = loadConfig();
