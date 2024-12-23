import { Server } from "../server";

export * as core from "@graphql-ice/core/core";

export async function createServer(
  coreModule: WebAssembly.Module
): Promise<Server> {
  console.log("Cloudflare Workers server");
  return await Server.create(coreModule);
}
