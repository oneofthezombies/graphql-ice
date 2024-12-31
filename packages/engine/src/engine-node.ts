import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  init as initInternal,
  initSync as initSyncInternal,
} from "./engine.js";

export const ENGINE_WASM_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../engine.wasm"
);

export async function init(engineWasmPath: string = ENGINE_WASM_PATH) {
  await initInternal(async (importObject) => {
    const bytes = await fs.promises.readFile(engineWasmPath);
    return await WebAssembly.instantiate(bytes, importObject);
  });
}

export function initSync(engineWasmPath: string = ENGINE_WASM_PATH) {
  initSyncInternal((importObject) => {
    const bytes = fs.readFileSync(engineWasmPath);
    const module = new WebAssembly.Module(bytes);
    return new WebAssembly.Instance(module, importObject);
  });
}
