import { createEngine } from "@graphql-ice/engine/adapter/vercel-functions-edge.js";
import core from "./core.wasm?module";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const engine = createEngine(core);

export async function GET(request: Request) {
  return new Response(await engine.ping());
}
