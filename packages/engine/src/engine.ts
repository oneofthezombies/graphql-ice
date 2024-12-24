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
    wasm = instance.exports;
    clearCachedMemories();
    __wbg_set_wasm(wasm);
    wasm.__wbindgen_start();
  }
  return wasm as unknown as Core;
}

export class Engine implements Core {
  ping: Core["ping"];

  constructor(core: WebAssembly.Module) {
    const coreExports = initCore(core);
    this.ping = coreExports.ping;
  }
}
