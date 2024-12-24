import {
  __wbg_set_wasm,
  clearCachedMemories,
  getWasm,
} from "./generated/core_bg.js";
import * as core_bg from "./generated/core_bg.js";

export interface GlobalCore {
  ping: () => Promise<string>;
}

export function initGlobalCore(core: WebAssembly.Module): GlobalCore {
  const instance = new WebAssembly.Instance(core, {
    "./core_bg.js": core_bg,
  });
  clearCachedMemories();

  const { exports } = instance;
  __wbg_set_wasm(exports);
  // @ts-expect-error
  exports.__wbindgen_start();
  return exports as unknown as GlobalCore;
}

export function getGlobalCore(): GlobalCore | undefined {
  return getWasm();
}
