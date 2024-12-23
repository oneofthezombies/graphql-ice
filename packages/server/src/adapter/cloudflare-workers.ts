import { Server } from "../server";
import core from "@graphql-ice/core/core";
export { core };

export async function createServer(
  coreModule: WebAssembly.Module
): Promise<Server> {
  console.log("Cloudflare Workers server");
  return await Server.create(coreModule);
}
