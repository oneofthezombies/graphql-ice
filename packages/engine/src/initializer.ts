import { AsyncCoreProvider, Core, SyncCoreProvider } from "./core";

export class Initializer {
  initSync(syncCoreProvider: SyncCoreProvider) {
    const core = syncCoreProvider.provideSync();
    Core.initSync(core);
  }

  async init(AsyncCoreProvider: AsyncCoreProvider) {
    const core = await AsyncCoreProvider.provide();
    await Core.init(core);
  }
}
