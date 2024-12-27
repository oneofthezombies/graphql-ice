import { Core } from "./engine.js";

export * from "./engine.js";

// @ts-expect-error
declare module "@graphql-ice/engine/core.wasm" {
  const core: Core;
  export default core;
}

// @ts-expect-error
declare module "@graphql-ice/engine/core.wasm?module" {
  const core: Core;
  export default core;
}
