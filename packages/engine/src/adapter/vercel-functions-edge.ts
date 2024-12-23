import { Engine } from "../engine";

export function createEngine(core: WebAssembly.Module): Engine {
  console.log("Vercel Functions Edge engine");
  console.log(core);
  return new Engine(core);
}
