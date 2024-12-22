import * as wasm from "./generated_bg.wasm";
import * as glue from "./generated";
import { Ice } from "./ice";

export async function createIce(module: WebAssembly.Module): Promise<Ice> {
  await glue.default({
    module_or_path: module,
  });
  return new Ice();
}
