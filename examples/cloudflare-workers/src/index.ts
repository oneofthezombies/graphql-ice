import { graphql, initOnce } from "@graphql-steel/steel";
import core from "@graphql-steel/steel/core_bg.wasm";

await initOnce(core);

export default {
  async fetch(req, env, ctx) {
    const result = await graphql({ schema: {}, source: "" });
    return new Response(JSON.stringify(result));
  },
} as ExportedHandler<Env>;
