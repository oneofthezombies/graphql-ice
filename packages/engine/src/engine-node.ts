import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  initIdempotently as initIdempotentlyInternal,
  initIdempotentlySync as initIdempotentlySyncInternal,
} from "./engine.js";

export const ENGINE_WASM_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../engine.wasm"
);

export async function initIdempotently(
  engineWasmPath: string = ENGINE_WASM_PATH
) {
  await initIdempotentlyInternal(async (imports) => {
    const bytes = await fs.promises.readFile(engineWasmPath);
    return await WebAssembly.instantiate(bytes, imports);
  });
}

export function initIdempotentlySync(
  engineWasmPath: string = ENGINE_WASM_PATH
) {
  initIdempotentlySyncInternal((imports) => {
    const bytes = fs.readFileSync(engineWasmPath);
    const module = new WebAssembly.Module(bytes);
    return new WebAssembly.Instance(module, imports);
  });
}
