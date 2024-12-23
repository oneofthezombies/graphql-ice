import init from "@graphql-ice/core/bindings";

export class Server {
  static async create(coreModule: WebAssembly.Module): Promise<Server> {
    await init({
      module_or_path: coreModule,
    });
    return new Server();
  }
}