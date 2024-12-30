import {
  initIdempotently as initIdempotentlyInternal,
  initIdempotentlySync as initIdempotentlySyncInternal,
} from "./engine.js";

export async function initIdempotently(engineWasmModule: WebAssembly.Module) {
  await initIdempotentlyInternal(async (imports) => {
    return await WebAssembly.instantiate(engineWasmModule, imports);
  });
}

export function initIdempotentlySync(engineWasmModule: WebAssembly.Module) {
  initIdempotentlySyncInternal((imports) => {
    return new WebAssembly.Instance(engineWasmModule, imports);
  });
}
