import {
  __wbg_set_wasm,
  start,
  clearCachedMemories,
  ping,
} from "./generated/core_bg.js";
import * as core_bg from "./generated/core_bg.js";

export interface AsyncCoreProvider {
  provide(): Promise<WebAssembly.Module>;
}

export interface SyncCoreProvider {
  provideSync(): WebAssembly.Module;
}

async function resolveCore(
  coreOrProvider: WebAssembly.Module | AsyncCoreProvider
): Promise<WebAssembly.Module> {
  if (coreOrProvider instanceof WebAssembly.Module) {
    return coreOrProvider;
  } else {
    return await coreOrProvider.provide();
  }
}

function resolveCoreSync(
  coreOrProvider: WebAssembly.Module | SyncCoreProvider
): WebAssembly.Module {
  if (coreOrProvider instanceof WebAssembly.Module) {
    return coreOrProvider;
  } else {
    return coreOrProvider.provideSync();
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
  engineImpl = new EngineInitialized();
}

function throwAlreadyInit(): never {
  throw new Error("Core is already initialized.");
}

function throwNotInit(): never {
  throw new Error("Core is not initialized.");
}

interface EngineInterface {
  init(coreOrProvider: WebAssembly.Module | AsyncCoreProvider): Promise<void>;
  initSync(coreOrProvider: WebAssembly.Module | SyncCoreProvider): void;
  ping(): Promise<string>;
}

class EngineInitialized implements EngineInterface {
  async init() {
    throwAlreadyInit();
  }

  initSync() {
    throwAlreadyInit();
  }

  async ping(): Promise<string> {
    return await ping();
  }
}

class EngineNotInitialized implements EngineInterface {
  async init(coreOrProvider: WebAssembly.Module | AsyncCoreProvider) {
    const core = await resolveCore(coreOrProvider);
    const imports = getImports();
    const instance = await WebAssembly.instantiate(core, imports);
    afterInstantiate(instance);
  }

  initSync(coreOrProvider: WebAssembly.Module | SyncCoreProvider) {
    const core = resolveCoreSync(coreOrProvider);
    const imports = getImports();
    const instance = new WebAssembly.Instance(core, imports);
    afterInstantiate(instance);
  }

  async ping(): Promise<string> {
    throwNotInit();
  }
}

class Engine implements EngineInterface {
  async init(core: WebAssembly.Module): Promise<void>;
  async init(provider: AsyncCoreProvider): Promise<void>;
  async init(
    coreOrProvider: WebAssembly.Module | AsyncCoreProvider
  ): Promise<void> {
    await engineImpl.init(coreOrProvider);
  }

  initSync(core: WebAssembly.Module): void;
  initSync(provider: SyncCoreProvider): void;
  initSync(coreOrProvider: WebAssembly.Module | SyncCoreProvider): void {
    engineImpl.initSync(coreOrProvider);
  }

  async ping(): Promise<string> {
    return await engineImpl.ping();
  }
}

let engineImpl = new EngineNotInitialized();

export const engine = new Engine();
