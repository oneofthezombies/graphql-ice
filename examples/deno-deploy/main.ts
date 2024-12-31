import { graphql, deno } from "npm:@graphql-steel/engine";

// deno.initSync();
await deno.init();

Deno.serve(async () => {
  // deno.initSync();
  // await deno.init();
  const result = await graphql({ schema: {}, source: "" });
  return new Response(JSON.stringify(result));
});
