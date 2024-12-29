import { initOnce } from "@graphql-steel/steel";
import core from "@graphql-steel/steel/core_bg.wasm";

Deno.serve(() => new Response("Hello, world!"));
