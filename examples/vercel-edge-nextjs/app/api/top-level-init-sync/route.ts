import { graphql, edge } from "@graphql-steel/engine";
import engineWasmModule from "@graphql-steel/engine/engine.wasm?module";
const { initIdempotentlySync } = edge;

export const dynamic = "force-dynamic";
export const runtime = "edge";

initIdempotentlySync(engineWasmModule);

export async function GET(request: Request) {
  const result = await graphql({ schema: {}, source: "" });
  return new Response(JSON.stringify(result));
}
