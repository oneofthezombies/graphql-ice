import { initIdempotently as initIdempotentlyInternal } from "./engine.js";
import { PACKAGE_VERSION } from "./package-version.js";

export const ENGINE_WASM_URL_ESM_SH = `https://esm.sh/@graphql-steel/engine@${PACKAGE_VERSION}/engine.wasm`;

export async function initIdempotently(
  engineWasmUrl: string = ENGINE_WASM_URL_ESM_SH
) {
  await initIdempotentlyInternal(async (imports) => {
    return await WebAssembly.instantiateStreaming(
      fetch(engineWasmUrl),
      imports
    );
  });
}
