import { Executor } from "./executor.js";
import init, { initSync, ping } from "./generated/core.js";

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

type InitArg = WebAssembly.Module | AsyncCoreProvider;
type InitSyncArg = WebAssembly.Module | SyncCoreProvider;
type SetState = (next: EngineState) => void;

interface EngineState {
  init(arg: InitArg): Promise<void>;
  initSync(arg: InitSyncArg): void;
  ping(): Promise<string>;
}

class InitEngineState implements EngineState {
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

class NotInitEngineState implements EngineState {
  #setState: SetState;

  constructor(setState: SetState) {
    this.#setState = setState;
  }

  async init(arg: InitArg) {
    validateInitArg(arg);
    const core = await resolveInitArg(arg);
    await init({ module_or_path: core });
    this.#setState(new InitEngineState());
  }

  initSync(arg: InitSyncArg) {
    validateInitArg(arg);
    const core = resolveInitSyncArg(arg);
    initSync({ module: core });
    this.#setState(new InitEngineState());
  }

  async ping(): Promise<string> {
    throw new EngineNotInitError();
  }
}

class Engine implements EngineState {
  #state: EngineState;

  constructor() {
    this.#state = new NotInitEngineState((next) => (this.#state = next));
  }

  async init(core: WebAssembly.Module): Promise<void>;
  async init(provider: AsyncCoreProvider): Promise<void>;
  async init(coreOrProvider: InitArg): Promise<void> {
    await this.#state.init(coreOrProvider);
  }

  initSync(core: WebAssembly.Module): void;
  initSync(provider: SyncCoreProvider): void;
  initSync(coreOrProvider: InitSyncArg): void {
    this.#state.initSync(coreOrProvider);
  }

  async ping(): Promise<string> {
    return await this.#state.ping();
  }
}

export const engine = new Engine();
