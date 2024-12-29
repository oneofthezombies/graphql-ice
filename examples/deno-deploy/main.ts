import { graphql, deno } from "@graphql-steel/steel";
const { initOnce } = deno;

await initOnce();

Deno.serve(async () => {
  const result = await graphql({ schema: {}, source: "" });
  return new Response(JSON.stringify(result));
});
