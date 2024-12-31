import { graphql, edge } from "@graphql-steel/engine";
import engineWasmModule from "@graphql-steel/engine/engine.wasm?module";

export const dynamic = "force-dynamic";
export const runtime = "edge";

edge.initSync(engineWasmModule);

export async function GET(request: Request) {
  const result = await graphql({ schema: {}, source: "" });
  return new Response(JSON.stringify(result));
}
