export class ServiceRegistry {
  private readonly services = new Map<string, unknown>();

  register<T>(name: string, service: T): void {
    if (this.services.has(name)) {
      throw new Error(`Service "${name}" is already registered.`);
    }

    this.services.set(name, service);
  }

  resolve<T>(name: string): T {
    const service = this.services.get(name);

    if (!service) {
      throw new Error(`Service "${name}" is not registered.`);
    }

    return service as T;
  }

  has(name: string): boolean {
    return this.services.has(name);
  }

  unregister(name: string): void {
    this.services.delete(name);
  }

  clear(): void {
    this.services.clear();
  }

  list(): string[] {
    return [...this.services.keys()];
  }
}

export const serviceRegistry = new ServiceRegistry();
