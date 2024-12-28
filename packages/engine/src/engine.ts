import init, { initSync, triggerPanic } from "./generated/core.js";

export class EngineAlreadyInitError extends Error {
  constructor() {
    super("Engine is already initialized");
  }
}

export class EngineNotInitError extends Error {
  constructor() {
    super("Must be initialized with initIce or Engine.initSync.");
  }
}

export class UnexpectedInitArgsError extends Error {
  constructor(args: unknown) {
    super(`Unexpected init arguments. args: ${JSON.stringify(args)}`);
  }
}

export type GraphQLSchema = {};

export type GraphQLArgs = {
  schema: GraphQLSchema;
  source: string;
};

export type ExecutionResult = {};

export type Core = WebAssembly.Module;

export interface Adapter {
  loadCore(): Promise<Core>;
  loadCoreSync(): Core;
}

type InitArgsWithCore = {
  core: Core;
  adapter?: never;
};

type InitArgsWithAdapter = {
  core?: never;
  adapter: Adapter;
};

export type InitArgs = InitArgsWithCore | InitArgsWithAdapter;

export type GraphqlFn = (args: GraphQLArgs) => Promise<ExecutionResult>;
export type GraphqlSyncFn = (args: GraphQLArgs) => ExecutionResult;

export type InitResult = {
  graphql: GraphqlFn;
  graphqlSync: GraphqlSyncFn;
  triggerPanic: () => void;
};

function checkAlreadyInit() {
  if (Engine.isInitialized) {
    throw new EngineAlreadyInitError();
  }
}

type ParseArgsResult = {
  core: Core;
};

async function parseArgs(args: InitArgs): Promise<ParseArgsResult> {
  checkAlreadyInit();
  if (args.core) {
    return { core: args.core };
  } else if (args.adapter) {
    const core = await args.adapter.loadCore();
    return { core };
  } else {
    throw new UnexpectedInitArgsError(args);
  }
}

function parseArgsSync(args: InitArgs): ParseArgsResult {
  checkAlreadyInit();
  if (args.core) {
    return { core: args.core };
  } else if (args.adapter) {
    const core = args.adapter.loadCoreSync();
    return { core };
  } else {
    throw new UnexpectedInitArgsError(args);
  }
}

export class Engine {
  static async init(args: InitArgs): Promise<InitResult> {
    const { core } = await parseArgs(args);
    await init({
      module_or_path: core,
    });

    return {
      graphql: async (args) => {
        return {} satisfies ExecutionResult;
      },
      graphqlSync: (args) => {
        return {} satisfies ExecutionResult;
      },
      triggerPanic: () => {
        triggerPanic();
      },
    };
  }

  static initSync(args: InitArgs): InitResult {
    const { core } = parseArgsSync(args);
    initSync({
      module: core,
    });

    return {
      graphql: async (args) => {
        return {} satisfies ExecutionResult;
      },
      graphqlSync: (args) => {
        return {} satisfies ExecutionResult;
      },
      triggerPanic: () => {
        triggerPanic();
      },
    };
  }

  static get isInitialized(): boolean {
    return "__wbindgen_wasm_module" in init;
  }

  static get(): InitResult {
    if (!Engine.isInitialized) {
      throw new EngineNotInitError();
    }

    return {
      graphql: async (args) => {
        return {} satisfies ExecutionResult;
      },
      graphqlSync: (args) => {
        return {} satisfies ExecutionResult;
      },
      triggerPanic: () => {
        triggerPanic();
      },
    };
  }
}
