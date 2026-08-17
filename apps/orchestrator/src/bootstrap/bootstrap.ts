import { config } from "@ampda/config";

import { EventBus } from "../events/EventBus.js";
import { loggerFactory } from "../logger/LoggerFactory.js";
import { Runtime } from "../runtime/Runtime.js";
import {
  ServiceRegistry,
} from "../services/ServiceRegistry.js";

export async function bootstrap(): Promise<void> {
  console.log("");
  console.log("=========================================");
  console.log(" AMPDA Runtime v0.1.0");
  console.log("=========================================");
  console.log("");

  const logger = loggerFactory.create("runtime");

  const eventBus = new EventBus();

  const serviceRegistry = new ServiceRegistry();

  serviceRegistry.register("logger", logger);
  serviceRegistry.register("eventBus", eventBus);
  serviceRegistry.register("serviceRegistry", serviceRegistry);

  const runtime = new Runtime({
    logger,
    eventBus,
    serviceRegistry,
    environment: config.NODE_ENV,
  });

  await runtime.start();

  async function shutdown(): Promise<void> {
    console.log("");

    await runtime.stop();

    process.exit(0);
  }

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}
