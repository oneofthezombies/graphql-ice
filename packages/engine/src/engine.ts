import { wasm_bindgen } from "./core-bindings.js";

export class Engine {
  ping: () => Promise<string>;

  constructor(core: WebAssembly.Module) {
    // @ts-ignore
    const initOutput = wasm_bindgen.initSync({
      module: core,
    });
    this.ping = initOutput.ping;
  }
}
