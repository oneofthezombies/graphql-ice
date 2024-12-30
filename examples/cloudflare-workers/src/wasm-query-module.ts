import { graphql, edge } from "@graphql-steel/engine";
import engineWasmModule from "@graphql-steel/engine/engine.wasm?module";
const { initIdempotently } = edge;

await initIdempotently(engineWasmModule);

export default {
  async fetch(req, env, ctx) {
    const result = await graphql({ schema: {}, source: "" });
    return new Response(JSON.stringify(result));
  },
} as ExportedHandler<Env>;
