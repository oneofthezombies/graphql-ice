import { createEngine } from "@graphql-ice/engine/adapter/cloudflare-workers.js";
import core from "@graphql-ice/engine/core.wasm";

const engine = createEngine(core);
const result = await engine.ping();
console.log(result);
