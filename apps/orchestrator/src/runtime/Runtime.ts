import type { Logger } from "../logger/Logger.js";
import type { EventBus } from "../events/EventBus.js";
import type { ServiceRegistry } from "../services/ServiceRegistry.js";

export interface RuntimeDependencies {
  logger: Logger;
  eventBus: EventBus;
  serviceRegistry: ServiceRegistry;
  environment: string;
}

export class Runtime {
  constructor(
    private readonly deps: RuntimeDependencies,
  ) {}

  public async start(): Promise<void> {
    this.deps.logger.info("Configuration loaded");
    this.deps.logger.info("Logger initialized");
    this.deps.logger.info("Event Bus initialized");
    this.deps.logger.info("Service Registry initialized");
    this.deps.logger.info(
      `Environment: ${this.deps.environment}`,
    );
    this.deps.logger.info("Runtime Ready");
  }

  public async stop(): Promise<void> {
    this.deps.logger.info("Stopping runtime...");

    this.deps.serviceRegistry.clear();
    this.deps.eventBus.clear();

    this.deps.logger.info("Runtime stopped.");
  }
}
