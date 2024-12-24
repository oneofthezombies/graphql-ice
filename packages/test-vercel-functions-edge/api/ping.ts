import { createEngine } from "@graphql-ice/engine/adapter/cloudflare-workers.js";
import core from "@graphql-ice/engine/core.wasm";

export const config = {
  runtime: "edge",
};

const engine = createEngine(core);

export async function GET(request: Request) {
  return new Response(await engine.ping());
}
