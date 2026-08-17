import { config } from "@ampda/config";

import { eventBus } from "../events/EventBus.js";
import { logger } from "../logger/Logger.js";
import { jobEngine } from "../services/JobEngineService.js";
import { serviceRegistry } from "../services/ServiceRegistry.js";

import { EventBus } from "../events/EventBus.js";
import { Logger } from "../logger/Logger.js";
import { JobEngineService } from "../services/JobEngineService.js";
import { ServiceRegistry } from "../services/ServiceRegistry.js";

export interface RuntimeOptions {
  logger: Logger;
  eventBus: EventBus;
  serviceRegistry: ServiceRegistry;
  jobEngine: JobEngineService;
  environment: string;
}

export class Runtime {
  constructor(
    private readonly options: RuntimeOptions,
  ) {}

  async start(): Promise<void> {
    const {
      logger,
      eventBus,
      serviceRegistry,
      jobEngine,
    } = this.options;

    logger.info("Configuration loaded");

    serviceRegistry.register(
      "logger",
      logger,
    );

    logger.info("Logger initialized");

    serviceRegistry.register(
      "eventBus",
      eventBus,
    );

    logger.info("Event Bus initialized");

    serviceRegistry.register(
      "serviceRegistry",
      serviceRegistry,
    );

    logger.info(
      "Service Registry initialized",
    );

    serviceRegistry.register(
      "jobEngine",
      jobEngine,
    );

    logger.info("Job Engine initialized");

    logger.info(
      `Environment: ${config.NODE_ENV}`,
    );

    logger.info("Runtime Ready");
  }

  async stop(): Promise<void> {
    const {
      logger,
      eventBus,
      serviceRegistry,
    } = this.options;

    logger.info("Stopping runtime...");

    serviceRegistry.clear();
    eventBus.clear();

    logger.info("Runtime stopped.");
  }
}

export const runtime =
  new Runtime({
    logger,
    eventBus,
    serviceRegistry,
    jobEngine,
    environment: config.NODE_ENV,
  });
