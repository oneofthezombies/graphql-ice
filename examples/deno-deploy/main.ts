import { graphql, initOnce } from "@graphql-steel/steel";
import core from "@graphql-steel/steel/core_bg.wasm";

Deno.serve(async () => {
  await initOnce(core);
  const result = await graphql({ schema: {}, source: "" });
  return new Response(JSON.stringify(result));
});
