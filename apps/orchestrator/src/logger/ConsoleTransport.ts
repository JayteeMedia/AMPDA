import type { LogRecord } from "./LogRecord.js";

export class ConsoleTransport {

  private readonly debug =
    process.env.AMPDA_DEBUG_PROMPTS === "true";

  write(
    record: LogRecord,
  ): void {

    if (this.debug) {

      console.log(
        JSON.stringify(
          record,
          null,
          2,
        ),
      );

      return;

    }

    const timestamp =
      record.timestamp ??
      new Date().toISOString();

    const level =
      (record.level ?? "info")
        .toUpperCase();

    const message =
      record.message ??
      "";

    console.log(
      `[${timestamp}] [${level}] ${message}`,
    );

  }

}
