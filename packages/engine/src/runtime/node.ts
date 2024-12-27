import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Adapter, Core } from "../engine.js";

export const CORE_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../generated/core_bg.wasm"
);

export class NodeAdapter implements Adapter {
  constructor(readonly corePath = CORE_PATH) {}

  async loadCore(): Promise<Core> {
    const bytes = await fs.promises.readFile(this.corePath);
    return await WebAssembly.compile(bytes);
  }

  loadCoreSync(): Core {
    const bytes = fs.readFileSync(this.corePath);
    return new WebAssembly.Module(bytes);
  }
}
