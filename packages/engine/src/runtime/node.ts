import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CoreAsyncLoader, CoreSyncLoader } from "../engine";

export const CORE_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../generated/core_bg.wasm"
);

export class NodeCoreLoader implements CoreSyncLoader, CoreAsyncLoader {
  constructor(readonly corePath = CORE_PATH) {}

  loadSync(): WebAssembly.Module {
    const bytes = fs.readFileSync(this.corePath);
    return new WebAssembly.Module(bytes);
  }

  async load(): Promise<WebAssembly.Module> {
    const bytes = await fs.promises.readFile(this.corePath);
    return await WebAssembly.compile(bytes);
  }
}
