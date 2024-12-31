import { init as initInternal } from "./engine.js";
export { initSync } from "./engine-browser.js";

export async function init(engineWasmModule: WebAssembly.Module) {
  await initInternal(async (importObject) => {
    return await WebAssembly.instantiate(engineWasmModule, importObject);
  });
}
