import { Engine } from "@graphql-ice/engine";
import core from "@graphql-ice/engine/core.wasm" assert { type: "webassembly" };

const engine = new Engine(core);
const result = await engine.ping();
console.log(result);
