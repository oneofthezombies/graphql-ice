import {
  __wbg_set_wasm,
  clearCachedMemories,
  getWasm,
} from "./generated/core_bg.js";
import * as core_bg from "./generated/core_bg.js";

interface GlobalCore {
  ping: () => Promise<string>;
}

function getGlobalCore(): GlobalCore | undefined {
  return getWasm();
}

function initGlobalCore(core: WebAssembly.Module): GlobalCore {
  let globalCore = getGlobalCore();
  if (globalCore) {
    throw new Error("Global core is already initialized.");
  }

  const instance = new WebAssembly.Instance(core, {
    "./core_bg.js": core_bg,
  });
  const { exports } = instance;
  clearCachedMemories();
  __wbg_set_wasm(exports);

  const __wbindgen_start = exports["__wbindgen_start"];
  if (typeof __wbindgen_start !== "function") {
    throw new Error("__wbindgen_start must be a function.");
  }
  __wbindgen_start();

  const ping = exports["ping"];
  if (typeof ping !== "function") {
    throw new Error("ping must be a function.");
  }

  return exports as unknown as GlobalCore;
}

export interface CoreSyncLoader {
  loadSync(): WebAssembly.Module;
}

export interface CoreAsyncLoader {
  load(): Promise<WebAssembly.Module>;
}

export class Engine implements GlobalCore {
  ping: GlobalCore["ping"];

  constructor(globalCore: GlobalCore) {
    this.ping = globalCore.ping;
  }

  static from(core: WebAssembly.Module): Engine {
    if (getGlobalCore()) {
      throw new Error("Global core is already initialized.");
    }

    const globalCore = initGlobalCore(core);
    return new Engine(globalCore);
  }

  static fromGlobal(): Engine {
    const globalCore = getGlobalCore();
    if (!globalCore) {
      throw new Error("Global core is not initialized.");
    }

    return new Engine(globalCore);
  }

  static loadSync(loader: CoreSyncLoader): Engine {
    const core = loader.loadSync();
    return Engine.from(core);
  }

  static async load(loader: CoreAsyncLoader): Promise<Engine> {
    const core = await loader.load();
    return Engine.from(core);
  }
}
