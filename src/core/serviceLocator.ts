export default class ServiceLocator {
    static #instance: ServiceLocator;
    readonly #services = new Map<string, unknown>();

    private constructor() {}

    static getInstance(): ServiceLocator {
        if (!ServiceLocator.#instance) {
            ServiceLocator.#instance = new ServiceLocator();
        }
        return ServiceLocator.#instance;
    }

    register<T>(service: T): void {
        const key = (service as { constructor: { name: string } }).constructor.name;
        this.#services.set(key, service);
    }

    get<T>(serviceClass: new (...args: any[]) => T): T {
        const key = serviceClass.name;
        return this.#services.get(key) as T;
    }
}
