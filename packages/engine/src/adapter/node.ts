import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Engine } from "../engine.js";

export async function createEngine() {
  console.log("Node.js engine");
  const corePath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../core.wasm"
  );
  const source = await fs.promises.readFile(corePath);
  const core = await WebAssembly.compile(source);
  return new Engine(core);
}
