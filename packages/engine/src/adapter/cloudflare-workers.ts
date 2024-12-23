import { Engine } from "../engine";

export function createEngine(core: WebAssembly.Module): Engine {
  console.log("Cloudflare Workers engine");
  return new Engine(core);
}
