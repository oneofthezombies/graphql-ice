import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AsyncCoreProvider, SyncCoreProvider } from "../engine.js";

export const CORE_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../generated/core_bg.wasm"
);

export class NodeCoreProvider implements AsyncCoreProvider, SyncCoreProvider {
  constructor(readonly corePath = CORE_PATH) {}

  async provide(): Promise<WebAssembly.Module> {
    const bytes = await fs.promises.readFile(this.corePath);
    return await WebAssembly.compile(bytes);
  }

  provideSync(): WebAssembly.Module {
    const bytes = fs.readFileSync(this.corePath);
    return new WebAssembly.Module(bytes);
  }
}
