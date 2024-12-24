import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Engine, getGlobalCore } from "../engine.js";

export const CORE_WASM_FULL_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../generated/core_bg.wasm"
);

async function loadCore(): Promise<WebAssembly.Module> {
  const bytes = await fs.promises.readFile(CORE_WASM_FULL_PATH);
  const core = await WebAssembly.compile(bytes);
  return core;
}

export async function createEngine(): Promise<Engine> {
  const globalCore = getGlobalCore();
  if (globalCore) {
    return new Engine(globalCore);
  }
  const core = await loadCore();
  return Engine.from(core);
}
