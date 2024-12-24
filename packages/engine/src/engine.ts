import {
  __wbg_set_wasm,
  clearCachedMemories,
  getWasm,
} from "./generated/core_bg.js";
import * as core_bg from "./generated/core_bg.js";

interface Core {
  ping: () => Promise<string>;
}

export function initCore(core: WebAssembly.Module): Core {
  let wasm = getWasm();
  if (!wasm) {
    const instance = new WebAssembly.Instance(core, {
      "./core_bg.js": core_bg,
    });
    clearCachedMemories();
    const exports = instance.exports;
    __wbg_set_wasm(exports);
    // @ts-expect-error
    exports.__wbindgen_start();
    wasm = exports;
  }
  return wasm as unknown as Core;
}

export class Engine implements Core {
  ping: Core["ping"];

  constructor(coreModule: WebAssembly.Module) {
    const core = initCore(coreModule);
    this.ping = core.ping;
  }
}
