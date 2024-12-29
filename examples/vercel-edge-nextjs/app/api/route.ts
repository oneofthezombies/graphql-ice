import { graphql, initOnce } from "@graphql-steel/steel";
import core from "@graphql-steel/steel/core_bg.wasm?module";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: Request) {
  await initOnce(core);
  const result = await graphql({ schema: {}, source: "" });
  return new Response(JSON.stringify(result));
}
