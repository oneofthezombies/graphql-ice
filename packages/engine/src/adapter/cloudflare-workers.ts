import { Engine } from "../engine.js";

export function createEngine(core: WebAssembly.Module): Engine {
  console.log("Cloudflare Workers engine");
  return new Engine(core);
}
