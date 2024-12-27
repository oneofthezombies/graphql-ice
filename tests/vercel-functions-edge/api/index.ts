/// <reference types="@edge-runtime/types" />

import { Engine } from "@graphql-ice/engine";
import core from "@graphql-ice/engine/core.wasm?module";

if (typeof EdgeRuntime !== "string") {
  throw new Error("Runtime is not edge");
}

export const config = {
  runtime: "edge",
};

const { graphql } = Engine.initSync({ core });

export async function GET(request: Request) {
  const result = await graphql({ schema: {}, source: "" });
  return new Response(JSON.stringify(result));
}
