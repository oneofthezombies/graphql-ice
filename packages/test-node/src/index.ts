import { createEngine } from "@graphql-ice/engine/adapter/node";

const engine = await createEngine();
console.log(await engine.hello());
