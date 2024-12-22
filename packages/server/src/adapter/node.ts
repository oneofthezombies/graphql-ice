import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "../server";

export async function createServer() {
  console.log("Node.js server");
  const corePath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../core.wasm"
  );
  const coreSource = await fs.promises.readFile(corePath);
  const coreModule = await WebAssembly.compile(coreSource);
  return await Server.create(coreModule);
}
