import { createEngine } from "@graphql-ice/engine/adapter/vercel-functions-edge";

export const config = {
  runtime: "edge",
};

const engine = await createEngine();

export async function GET(request: Request) {
  return new Response(await engine.ping());
}
