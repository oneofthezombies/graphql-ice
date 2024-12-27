import { Engine } from "@graphql-ice/engine";
import core from "@graphql-ice/engine/core.wasm";

const { graphql } = await Engine.init({ core });

export default {
  async fetch(req, env, ctx) {
    const result = await graphql({ schema: {}, source: "" });
    return new Response(JSON.stringify(result));
  },
} as ExportedHandler<Env>;
