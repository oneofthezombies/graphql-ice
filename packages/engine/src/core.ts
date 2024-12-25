import {
  __wbg_set_wasm,
  start,
  clearCachedMemories,
  getWasm,
  ping,
} from "./generated/core_bg.js";
import * as core_bg from "./generated/core_bg.js";

export class Core {
  static async init(core: WebAssembly.Module) {
    const imports = Core.beforeInstantiate();
    const instance = await WebAssembly.instantiate(core, imports);
    Core.afterInstantiate(instance);
  }

  static initSync(core: WebAssembly.Module) {
    const imports = Core.beforeInstantiate();
    const instance = new WebAssembly.Instance(core, imports);
    Core.afterInstantiate(instance);
  }

  static async ping(): Promise<string> {
    return await ping();
  }

  private static get(): Core | undefined {
    return getWasm();
  }

  private static beforeInstantiate(): WebAssembly.Imports {
    if (Core.get()) {
      throw new Error("Core is already initialized.");
    }

    return {
      "./core_bg.js": core_bg,
    };
  }

  private static afterInstantiate(instance: WebAssembly.Instance) {
    const { exports } = instance;
    clearCachedMemories();
    __wbg_set_wasm(exports);
    start();
  }
}

export interface SyncCoreProvider {
  provideSync(): WebAssembly.Module;
}

export interface AsyncCoreProvider {
  provide(): Promise<WebAssembly.Module>;
}

export class EdgeCoreProvider implements SyncCoreProvider, AsyncCoreProvider {
  constructor(readonly core: WebAssembly.Module) {}

  provideSync(): WebAssembly.Module {
    return this.core;
  }

  async provide(): Promise<WebAssembly.Module> {
    return this.core;
  }
}
