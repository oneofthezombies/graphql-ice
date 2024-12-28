import { Engine } from "@graphql-steel/engine";
import core from "@graphql-steel/engine/core.wasm?module";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: Request) {
  const { graphql } = await Engine.init({ core });
  const result = await graphql({ schema: {}, source: "" });
  return new Response(JSON.stringify(result));
}
