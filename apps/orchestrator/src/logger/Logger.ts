export type LogLevel =
  | "trace"
  | "debug"
  | "info"
  | "warn"
  | "error";

export class Logger {
  constructor(
    private readonly level: LogLevel = "info",
  ) {}

  private write(
    level: LogLevel,
    message: string,
  ): void {
    const timestamp = new Date().toISOString();

    console.log(
      `[${timestamp}] [${level.toUpperCase()}] ${message}`,
    );
  }

  trace(message: string): void {
    this.write("trace", message);
  }

  debug(message: string): void {
    this.write("debug", message);
  }

  info(message: string): void {
    this.write("info", message);
  }

  warn(message: string): void {
    this.write("warn", message);
  }

  error(message: string): void {
    this.write("error", message);
  }

  getLevel(): LogLevel {
    return this.level;
  }
}

export const logger = new Logger();
