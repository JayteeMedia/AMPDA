import { Logger } from "./Logger.js";

export class LoggerFactory {
  create(service: string): Logger {
    return new Logger(service);
  }
}

export const loggerFactory = new LoggerFactory();
