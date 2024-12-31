import {
  __wbg_set_wasm,
  on_start,
  trigger_panic,
  graphql as graphqlBinding,
  graphql_sync,
} from "./engine-bindings.js";
import * as moduleImports from "./engine-bindings.js";

export type PromiseOrValue<T> = Promise<T> | T;

export type InstantiateResult =
  | WebAssembly.Instance
  | WebAssembly.WebAssemblyInstantiatedSource;

export type InstantiatePromiseOrValue = PromiseOrValue<InstantiateResult>;

export type Instantiate = (
  importObject: WebAssembly.Imports
) => InstantiatePromiseOrValue;

export type InstantiateSync = (
  importObject: WebAssembly.Imports
) => InstantiateResult;

export type GraphQLSchema = {};

export type GraphQLArgs = {
  schema: GraphQLSchema;
  source: string;
};

export type ExecutionResult = {};

export class EngineNotInitError extends Error {
  constructor() {
    super("Must be initialized with init() or initSync().");
  }
}

const context: {
  isInitialized: boolean;
  instantiatePromiseOrValue: InstantiatePromiseOrValue | null;
} = {
  isInitialized: false,
  instantiatePromiseOrValue: null,
};

export function isInitialized(): boolean {
  return context.isInitialized;
}

export const IMPORT_MODULE_NAME = "./engine_bg.js";

function getImportObject(): WebAssembly.Imports {
  const importObject: WebAssembly.Imports = {};
  importObject[IMPORT_MODULE_NAME] = moduleImports;
  return importObject;
}

function postInstantiate(instantiateResult: InstantiateResult) {
  const exports: WebAssembly.Exports =
    "instance" in instantiateResult
      ? instantiateResult.instance.exports
      : instantiateResult.exports;
  __wbg_set_wasm(exports);
  on_start();
  context.isInitialized = true;
}

export async function init(instantiate: Instantiate) {
  if (context.isInitialized) {
    return;
  }

  if (!context.instantiatePromiseOrValue) {
    const importObject = getImportObject();
    context.instantiatePromiseOrValue = instantiate(importObject);
  }

  try {
    const instantiateResult = await context.instantiatePromiseOrValue;
    postInstantiate(instantiateResult);
  } finally {
    context.instantiatePromiseOrValue = null;
  }
}

export function initSync(instantiateSync: InstantiateSync) {
  if (context.isInitialized) {
    return;
  }

  const importObject = getImportObject();
  const instantiateResult = instantiateSync(importObject);
  postInstantiate(instantiateResult);
  context.isInitialized = true;
}

function checkInit() {
  if (!context.isInitialized) {
    throw new EngineNotInitError();
  }
}

export function triggerPanic() {
  checkInit();
  trigger_panic();
}

export async function graphql(args: GraphQLArgs): Promise<ExecutionResult> {
  checkInit();
  return await graphqlBinding(args);
}

export function graphqlSync(args: GraphQLArgs): ExecutionResult {
  checkInit();
  return graphql_sync(args);
}
