import {
  __wbg_set_wasm,
  start,
  clearCachedMemories,
  getWasm,
  ping,
} from "./generated/core_bg.js";
import * as core_bg from "./generated/core_bg.js";

function parseCoreOrProviderSync(
  coreOrProvider: WebAssembly.Module | SyncCoreProvider
): WebAssembly.Module {
  if (coreOrProvider instanceof WebAssembly.Module) {
    return coreOrProvider;
  } else {
    return coreOrProvider.provideSync();
  }
}

async function parseCoreOrProvider(
  coreOrProvider: WebAssembly.Module | AsyncCoreProvider
): Promise<WebAssembly.Module> {
  if (coreOrProvider instanceof WebAssembly.Module) {
    return coreOrProvider;
  } else {
    return await coreOrProvider.provide();
  }
}

function validateInit() {
  if (getWasm()) {
    throw new Error("Core is already initialized.");
  }
}

function getImports(): WebAssembly.Imports {
  return {
    "./core_bg.js": core_bg,
  };
}

function afterInstantiate(instance: WebAssembly.Instance) {
  const { exports } = instance;
  clearCachedMemories();
  __wbg_set_wasm(exports);
  start();
}

export interface SyncCoreProvider {
  provideSync(): WebAssembly.Module;
}

export interface AsyncCoreProvider {
  provide(): Promise<WebAssembly.Module>;
}

export class Core {
  static async init(core: WebAssembly.Module): Promise<void>;
  static async init(provider: AsyncCoreProvider): Promise<void>;
  static async init(coreOrProvider: WebAssembly.Module | AsyncCoreProvider) {
    validateInit();
    const core = await parseCoreOrProvider(coreOrProvider);
    const imports = getImports();
    const instance = await WebAssembly.instantiate(core, imports);
    afterInstantiate(instance);
  }

  static initSync(core: WebAssembly.Module): void;
  static initSync(provider: SyncCoreProvider): void;
  static initSync(coreOrProvider: WebAssembly.Module | SyncCoreProvider) {
    validateInit();
    const core = parseCoreOrProviderSync(coreOrProvider);
    const imports = getImports();
    const instance = new WebAssembly.Instance(core, imports);
    afterInstantiate(instance);
  }

  static async ping(): Promise<string> {
    return await ping();
  }
}
