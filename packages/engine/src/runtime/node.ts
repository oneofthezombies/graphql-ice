import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  initOnce as steelInitOnce,
  initOnceSync as steelInitOnceSync,
  isInitialized,
} from "../steel.js";

export const CORE_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../gen/core_bg.wasm"
);

export async function initOnce() {
  if (isInitialized()) {
    return;
  }

  const bytes = await fs.promises.readFile(CORE_PATH);
  const core = await WebAssembly.compile(bytes);
  await steelInitOnce(core);
}

export function initOnceSync() {
  if (isInitialized()) {
    return;
  }

  const bytes = fs.readFileSync(CORE_PATH);
  const core = new WebAssembly.Module(bytes);
  steelInitOnceSync(core);
}
