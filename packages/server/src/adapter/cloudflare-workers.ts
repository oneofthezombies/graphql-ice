import { Server } from "../server";

export async function createServer(
  coreModule: WebAssembly.Module
): Promise<Server> {
  console.log("Cloudflare Workers server");
  return await Server.create(coreModule);
}
