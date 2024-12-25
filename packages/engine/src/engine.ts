import {
  __wbg_set_wasm,
  start,
  clearCachedMemories,
  ping,
} from "./generated/core_bg.js";
import * as core_bg from "./generated/core_bg.js";

export class EngineAlreadyInitError extends Error {
  constructor() {
    super("Engine is already initialized");
  }
}

export class EngineNotInitError extends Error {
  constructor() {
    super("Engine is not initialized");
  }
}

export class UnexpectedInitArgError extends Error {
  constructor(arg: unknown) {
    super(`Unexpected init argument. arg: ${JSON.stringify(arg)}`);
  }
}

export interface AsyncCoreProvider {
  provide(): Promise<WebAssembly.Module>;
}

export interface SyncCoreProvider {
  provideSync(): WebAssembly.Module;
}

function validateInitArg(arg: any) {
  if (!arg) {
    throw new UnexpectedInitArgError(arg);
  }
}

async function resolveInitArg(arg: InitArg): Promise<WebAssembly.Module> {
  if (arg instanceof WebAssembly.Module) {
    return arg;
  } else {
    if (
      typeof arg === "object" &&
      "provide" in arg &&
      typeof arg["provide"] === "function"
    ) {
      const maybePromise = arg.provide();
      if (maybePromise instanceof Promise) {
        const result = await maybePromise;
        if (result instanceof WebAssembly.Module) {
          return result;
        }
      }
    }

    throw new UnexpectedInitArgError(arg);
  }
}

function resolveInitSyncArg(arg: InitSyncArg): WebAssembly.Module {
  if (arg instanceof WebAssembly.Module) {
    return arg;
  } else {
    if (
      typeof arg === "object" &&
      "provideSync" in arg &&
      typeof arg["provideSync"] === "function"
    ) {
      const result = arg.provideSync();
      if (result instanceof WebAssembly.Module) {
        return result;
      }
    }

    throw new UnexpectedInitArgError(arg);
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

type InitArg = WebAssembly.Module | AsyncCoreProvider;
type InitSyncArg = WebAssembly.Module | SyncCoreProvider;

interface EngineInterface {
  init(arg: InitArg): Promise<void>;
  initSync(arg: InitSyncArg): void;
  ping(): Promise<string>;
}

class EngineInitialized implements EngineInterface {
  async init() {
    throw new EngineAlreadyInitError();
  }

  initSync() {
    throw new EngineAlreadyInitError();
  }

  async ping(): Promise<string> {
    return await ping();
  }
}

class EngineNotInitialized implements EngineInterface {
  async init(arg: InitArg) {
    validateInitArg(arg);
    const core = await resolveInitArg(arg);
    const instance = await WebAssembly.instantiate(core, getImports());
    afterInstantiate(instance);
  }

  initSync(arg: InitSyncArg) {
    validateInitArg(arg);
    const core = resolveInitSyncArg(arg);
    const instance = new WebAssembly.Instance(core, getImports());
    afterInstantiate(instance);
  }

  async ping(): Promise<string> {
    throw new EngineNotInitError();
  }
}

class Engine implements EngineInterface {
  async init(core: WebAssembly.Module): Promise<void>;
  async init(provider: AsyncCoreProvider): Promise<void>;
  async init(coreOrProvider: InitArg): Promise<void> {
    await engineImpl.init(coreOrProvider);
  }

  initSync(core: WebAssembly.Module): void;
  initSync(provider: SyncCoreProvider): void;
  initSync(coreOrProvider: InitSyncArg): void {
    engineImpl.initSync(coreOrProvider);
  }

  async ping(): Promise<string> {
    return await engineImpl.ping();
  }
}

let engineImpl = new EngineNotInitialized();

export const engine = new Engine();
