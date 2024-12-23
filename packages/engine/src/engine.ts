import init, { type InitOutput } from "./generated/core-bindings";

export class Engine {
  hello: () => Promise<string>;

  private constructor(initOutput: InitOutput) {
    this.hello = initOutput.hello;
  }

  static async create(coreModule: WebAssembly.Module): Promise<Engine> {
    const initOutput = await init({
      module_or_path: coreModule,
    });
    return new Engine(initOutput);
  }
}
