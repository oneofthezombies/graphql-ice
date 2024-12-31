import {
  init as initInternal,
  initSync as initSyncInternal,
} from "./engine.js";
import { PACKAGE_VERSION } from "./package-version.js";

export const ENGINE_WASM_URL_JSDELIVR = `https://cdn.jsdelivr.net/npm/@graphql-steel/engine@${PACKAGE_VERSION}/engine.wasm`;

export type InitInput = string | URL | Request | WebAssembly.Module;

export async function init(input: InitInput = ENGINE_WASM_URL_JSDELIVR) {
  await initInternal(async (importObject) => {
    if (
      typeof input === "string" ||
      input instanceof URL ||
      input instanceof Request
    ) {
      return await WebAssembly.instantiateStreaming(fetch(input), importObject);
    } else if (input instanceof WebAssembly.Module) {
      return await WebAssembly.instantiate(input, importObject);
    } else {
      throw new Error(`Unexpected input type: ${typeof input}`);
    }
  });
}

export function initSync(engineWasmModule: WebAssembly.Module) {
  initSyncInternal((importObject) => {
    return new WebAssembly.Instance(engineWasmModule, importObject);
  });
}
