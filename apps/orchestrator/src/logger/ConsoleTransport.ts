import type { LogRecord } from "./LogRecord.js";

export class ConsoleTransport {
  write(record: LogRecord): void {
    console.log(JSON.stringify(record));
  }
}
