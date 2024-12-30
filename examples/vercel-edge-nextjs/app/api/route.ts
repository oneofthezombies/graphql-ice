import { graphql, edgeLight } from "@graphql-steel/engine";
import core from "@graphql-steel/engine/engine.wasm?module";
const { initIdempotently } = edgeLight;

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: Request) {
  await initIdempotently(core);
  const result = await graphql({ schema: {}, source: "" });
  return new Response(JSON.stringify(result));
}
