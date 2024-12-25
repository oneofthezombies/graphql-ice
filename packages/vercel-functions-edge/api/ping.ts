import { Engine } from "@graphql-ice/engine";

// @ts-expect-error
import core from "@graphql-ice/engine/core.wasm?module";

export const config = {
  runtime: "edge",
};

const engine = new Engine(core);

export async function GET(request: Request) {
  return new Response(await engine.ping());
}
