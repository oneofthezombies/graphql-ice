import {
  initIdempotently as initIdempotentlyInternal,
  initIdempotentlySync as initIdempotentlySyncInternal,
} from "./engine.js";
import { PACKAGE_VERSION } from "./package-version.js";

export const ENGINE_WASM_URL_JSDELIVR = `https://cdn.jsdelivr.net/npm/@graphql-steel/engine@${PACKAGE_VERSION}/engine.wasm`;

export type InitInput = string | URL | Request | WebAssembly.Module;

export async function initIdempotently(
  input: InitInput = ENGINE_WASM_URL_JSDELIVR
) {
  await initIdempotentlyInternal(async (importObject) => {
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

export function initIdempotentlySync(engineWasmModule: WebAssembly.Module) {
  initIdempotentlySyncInternal((importObject) => {
    return new WebAssembly.Instance(engineWasmModule, importObject);
  });
}
