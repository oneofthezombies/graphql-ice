import { Engine } from "../engine";

export async function createEngine(
  coreModule: WebAssembly.Module
): Promise<Engine> {
  console.log("Cloudflare Workers engine");
  return await Engine.create(coreModule);
}
