import { graphql, edge } from "@graphql-steel/engine";
import engineWasmModule from "@graphql-steel/engine/engine.wasm";

await edge.init(engineWasmModule);

export default {
  async fetch(req, env, ctx) {
    const result = await graphql({ schema: {}, source: "" });
    return new Response(JSON.stringify(result));
  },
} as ExportedHandler<Env>;
