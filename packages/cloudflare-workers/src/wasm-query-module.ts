import { Engine } from "@graphql-steel/engine";
import core from "@graphql-steel/engine/core.wasm?module";

const { graphql } = await Engine.init({ core });

export default {
  async fetch(req, env, ctx) {
    const result = await graphql({ schema: {}, source: "" });
    return new Response(JSON.stringify(result));
  },
} as ExportedHandler<Env>;
