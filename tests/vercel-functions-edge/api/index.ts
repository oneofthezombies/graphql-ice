import { Engine } from "@graphql-ice/engine";
import core from "@graphql-ice/engine/core.wasm?module";

export const config = {
  runtime: "edge",
};

const { graphql } = await Engine.init({ core });

export async function GET(request: Request) {
  const result = await graphql({ schema: {}, source: "" });
  return new Response(JSON.stringify(result));
}
