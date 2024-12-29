import init, {
  InitOutput,
  initSync,
  trigger_panic,
  graphql as coreGraphql,
  graphql_sync,
} from "../gen/core.js";

export class SteelNotInitError extends Error {
  constructor() {
    super("Must be initialized with init or initSync.");
  }
}

export type GraphQLSchema = {};

export type GraphQLArgs = {
  schema: GraphQLSchema;
  source: string;
};

export type ExecutionResult = {};

export function isInitialized(): boolean {
  return (
    "__wbindgen_wasm_module" in init &&
    init.__wbindgen_wasm_module !== undefined
  );
}

let coreInitTask: Promise<InitOutput> | null = null;

export async function initOnce(core: WebAssembly.Module) {
  if (isInitialized()) {
    return;
  }

  if (!coreInitTask) {
    coreInitTask = init({
      module_or_path: core,
    });
  }

  try {
    await coreInitTask;
  } finally {
    coreInitTask = null;
  }
}

export function initOnceSync(core: WebAssembly.Module) {
  if (isInitialized()) {
    return;
  }

  initSync({
    module: core,
  });
}

function checkInit() {
  if (!isInitialized()) {
    throw new SteelNotInitError();
  }
}

export function triggerPanic() {
  checkInit();
  trigger_panic();
}

export async function graphql(args: GraphQLArgs): Promise<ExecutionResult> {
  checkInit();
  return await coreGraphql(args);
}

export function graphqlSync(args: GraphQLArgs): ExecutionResult {
  checkInit();
  return graphql_sync(args);
}
