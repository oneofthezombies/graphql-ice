import init, { type InitOutput } from "./generated/core-bindings";

export class Engine {
  ping: () => Promise<string>;

  private constructor(initOutput: InitOutput) {
    this.ping = initOutput.ping;
  }

  static async create(coreModule?: WebAssembly.Module): Promise<Engine> {
    const initOutput = await init(
      coreModule
        ? {
            module_or_path: coreModule,
          }
        : undefined
    );
    return new Engine(initOutput);
  }
}
