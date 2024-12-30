import { graphql, deno } from "@graphql-steel/engine";
const { initIdempotently } = deno;

await initIdempotently();

Deno.serve(async () => {
  const result = await graphql({ schema: {}, source: "" });
  return new Response(JSON.stringify(result));
});
