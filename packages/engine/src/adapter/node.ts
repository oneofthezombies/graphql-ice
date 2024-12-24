import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Engine } from "../engine.js";
import { getGlobalCore } from "../global-core.js";

export const CORE_WASM_FULL_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../generated/core_bg.wasm"
);

export async function createEngine(): Promise<Engine> {
  const globalCore = getGlobalCore();
  if (globalCore) {
    return new Engine(globalCore);
  }
  const bytes = await fs.promises.readFile(CORE_WASM_FULL_PATH);
  const core = await WebAssembly.compile(bytes);
  return Engine.from(core);
}
