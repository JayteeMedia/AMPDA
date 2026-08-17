import type { LogLevel } from "./LogLevel.js";

export interface LogRecord {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  metadata?: Record<string, unknown>;
}
