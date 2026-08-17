import type { LogLevel } from "./LogLevel.js";
import type { LogRecord } from "./LogRecord.js";
import { ConsoleTransport } from "./ConsoleTransport.js";

export class Logger {
  constructor(
    private readonly service: string,
    private readonly transport = new ConsoleTransport(),
  ) {}

  private write(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>,
  ): void {
    const record: LogRecord = {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      message,
      metadata,
    };

    this.transport.write(record);
  }

  trace(message: string, metadata?: Record<string, unknown>): void {
    this.write("trace", message, metadata);
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.write("debug", message, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.write("info", message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.write("warn", message, metadata);
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    this.write("error", message, metadata);
  }

  fatal(message: string, metadata?: Record<string, unknown>): void {
    this.write("fatal", message, metadata);
  }
}
