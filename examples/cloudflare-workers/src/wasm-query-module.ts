import { graphql, initIdempotently } from "@graphql-steel/engine";
import engineWasmModule from "@graphql-steel/engine/engine.wasm";

await initIdempotently(async (imports) => {
  return await WebAssembly.instantiate(engineWasmModule, imports);
});

export default {
  async fetch(req, env, ctx) {
    const result = await graphql({ schema: {}, source: "" });
    return new Response(JSON.stringify(result));
  },
} as ExportedHandler<Env>;
