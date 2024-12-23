import { initSync } from "./core-bindings";

export class Engine {
  ping: () => Promise<string>;

  constructor(core: WebAssembly.Module) {
    const initOutput = initSync({
      module: core,
    });
    this.ping = initOutput.ping;
  }
}
