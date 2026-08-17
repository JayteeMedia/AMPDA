import { Logger, type LogLevel } from "./Logger.js";

export class LoggerFactory {
  create(
    level: LogLevel = "info",
  ): Logger {
    return new Logger(level);
  }
}

export const loggerFactory =
  new LoggerFactory();
