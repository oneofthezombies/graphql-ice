import { init } from "../generated/core.js";
import { Engine } from "../index.js";

export function createEngine(core: WebAssembly.Module): Engine {
  console.log("Cloudflare Workers engine");
  const engine = init<Engine>(core);
  console.log(engine);
  return {
    ping: async (): Promise<string> => {
      return await engine.ping();
    },
  };
}
