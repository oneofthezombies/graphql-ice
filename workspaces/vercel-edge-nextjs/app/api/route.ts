import { Engine } from "@graphql-steel/engine";
// @ts-expect-error
import core from "@graphql-steel/engine/core.wasm?module";

// // @ts-expect-error
// import core from "@/public/core_bg.wasm?module";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: Request) {
  const result = core;
  // const core = await import("@graphql-steel/engine/core.wasm?module");?
  // console.log("@", core);
  // const { graphql } = await Engine.init({ core });
  // const result = await graphql({ schema: {}, source: "" });
  return new Response(JSON.stringify(result));
}
