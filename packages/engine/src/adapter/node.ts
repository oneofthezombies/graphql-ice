import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Engine } from "../engine";

export async function createEngine() {
  console.log("Node.js engine");
  const corePath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../generated/core.wasm"
  );
  const coreSource = await fs.promises.readFile(corePath);
  const coreModule = await WebAssembly.compile(coreSource);
  return await Engine.create(coreModule);
}
