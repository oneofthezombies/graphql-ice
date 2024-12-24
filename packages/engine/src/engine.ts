import { getGlobalCore, GlobalCore, initGlobalCore } from "./global-core.js";

export class Engine implements GlobalCore {
  ping: GlobalCore["ping"];

  constructor(globalCore: GlobalCore) {
    this.ping = globalCore.ping;
  }

  static from(core: WebAssembly.Module): Engine {
    let globalCore = getGlobalCore();
    if (!globalCore) {
      globalCore = initGlobalCore(core);
    }
    return new Engine(globalCore);
  }
}
