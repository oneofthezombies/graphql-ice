import { graphql, deno } from "npm:@graphql-steel/engine";
const { initIdempotently, initIdempotentlySync } = deno;

// initIdempotentlySync();
await initIdempotently();

Deno.serve(async () => {
  // initIdempotentlySync();
  // await initIdempotently();
  const result = await graphql({ schema: {}, source: "" });
  return new Response(JSON.stringify(result));
});
