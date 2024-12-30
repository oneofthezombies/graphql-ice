import { spawnSync, SpawnSyncOptions } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import args from "args";

/**
 * Path Naming Rules
 *
 * relative | full | relOrFull
 * file | directory | fileOrDir
 *
 * relative file -> relFilePath
 * relative directory -> relDirPath
 * relative fileOrDir -> relPath
 * full file -> fullFilePath
 * full directory -> fullDirPath
 * full fileOrDir -> fullPath
 * relOrFull file -> filePath
 * relOrFull directory -> dirPath
 * relOrFull fileOrDir -> path
 */

const CRATE_NAME = "graphql_steel_engine_js";
const CRATE_FULL_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../crates",
  CRATE_NAME
);
const BUILD_DEBUG_FULL_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../packages/engine-debug"
);
const BUILD_RELEASE_FULL_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../packages/engine"
);
const WASM_NAME = "engine";

function run(command: string, args?: string[], options?: SpawnSyncOptions) {
  args ??= [];
  options ??= {};
  if (!options.stdio) {
    options.stdio = "inherit";
  }
  const result = spawnSync(command, args, options);
  const { error, status, stderr } = result;
  if (error) {
    const commandLine = command + " " + args.join(" ");
    throw new Error(`${commandLine} failed. error: ${error}`);
  }

  if (status !== 0) {
    const commandLine = command + " " + args.join(" ");
    const stderrString = stderr?.toString().trim();
    throw new Error(
      `${commandLine} failed. status: ${status}` +
        (stderrString ? ` stderr: ${stderrString}` : "")
    );
  }
}

function build(profile: string, buildFullDirPath: string) {
  console.log(`Build... profile: ${profile}`);
  const targetFeatures = [
    // cSpell:disable
    "+atomics",
    "+bulk-memory",
    "+exception-handling",
    "+extended-const",
    "+multivalue",
    "+mutable-globals",
    "+nontrapping-fptoint",
    "+reference-types",
    "+relaxed-simd",
    "+sign-ext",
    "+simd128",
    // cSpell:enable
  ];
  const args = ["build"];
  if (profile === "release") {
    args.push("--release");
  }
  args.push("--target=wasm32-unknown-unknown");
  run("cargo", args, {
    cwd: CRATE_FULL_PATH,
    env: {
      ...process.env,
      // cSpell:disable-next-line
      RUSTFLAGS: "-Ctarget-feature=" + targetFeatures.join(","),
    },
  });
  run(
    "wasm-bindgen",
    [
      "--out-dir",
      buildFullDirPath,
      "--out-name",
      WASM_NAME,
      "--target",
      "bundler",
      "--omit-default-module-path",
      `../../target/wasm32-unknown-unknown/${profile}/${CRATE_NAME}.wasm`,
    ],
    {
      cwd: CRATE_FULL_PATH,
    }
  );
}

function getWasmDtsContent(packageName: string) {
  return `export {};
export default {} as WebAssembly.Module;
export declare module "@graphql-steel/${packageName}/core.wasm" {
  export default WebAssembly.Module;
}
export declare module "@graphql-steel/${packageName}/core.wasm?module" {
  export default WebAssembly.Module;
}
`;
}

function postBuild(profile: string, buildFullDirPath: string) {
  console.log(`Post build... profile: ${profile}`);
  const currentFullDirPath = process.cwd();
  try {
    process.chdir(buildFullDirPath);

    const wasmRelFilePath = `${WASM_NAME}.wasm`;
    fs.renameSync(`${WASM_NAME}_bg.wasm`, wasmRelFilePath);
    if (profile === "release") {
      run("wasm-opt", [wasmRelFilePath, "-o", wasmRelFilePath, "-O3"]);
    }

    fs.rmSync("engine.js");
    fs.rmSync("engine.d.ts");
    fs.rmSync("engine_bg.wasm.d.ts");
    if (profile === "debug") {
      fs.rmSync("engine_bg.js");
      fs.writeFileSync("engine.wasm.d.ts", getWasmDtsContent("engine-debug"));
    } else if (profile === "release") {
      fs.renameSync("engine_bg.js", "src/engine-bindings.js");
      fs.writeFileSync("engine.wasm.d.ts", getWasmDtsContent("engine"));
    }
  } finally {
    process.chdir(currentFullDirPath);
  }
}

function main() {
  const flags = args
    .option("debug", "build with debug information.")
    .parse(process.argv);
  const profile = flags.debug ? "debug" : "release";
  const buildFullDirPath = flags.debug
    ? BUILD_DEBUG_FULL_PATH
    : BUILD_RELEASE_FULL_PATH;
  build(profile, buildFullDirPath);
  postBuild(profile, buildFullDirPath);
}

main();
