import { graphql, edge } from "@graphql-steel/engine";
import engineWasmModule from "@graphql-steel/engine/engine.wasm?module";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: Request) {
  edge.initSync(engineWasmModule);
  const result = await graphql({ schema: {}, source: "" });
  return new Response(JSON.stringify(result));
}
