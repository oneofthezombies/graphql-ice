import { spawnSync, SpawnSyncOptions } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

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

function run(command: string, args?: string[], options?: SpawnSyncOptions) {
  args ??= [];
  options ??= {};
  if (!options.stdio) {
    options.stdio = "inherit";
  }
  const result = spawnSync(command, args, options);
  const { error, status, stderr } = result;
  if (error) {
    const commandLine = command + args.join(" ");
    throw new Error(`${commandLine} failed. error: ${error}`);
  }

  if (status !== 0) {
    const commandLine = command + args.join(" ");
    const stderrString = stderr?.toString().trim();
    throw new Error(
      `${commandLine} failed. status: ${status}` +
        (stderrString ? ` stderr: ${stderrString}` : "")
    );
  }
}

function rm(path: string) {
  console.log(`Delete... path: ${path}`);
  fs.rmSync(path, { recursive: true, force: true });
}

function build(outFullDirPath: string, outName: string) {
  const coreCrateFullDirPath = path.resolve(process.cwd(), "../../crates/core");
  console.log(`Build... path: ${coreCrateFullDirPath}`);
  const targetFeatures = [
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
  ];
  run(
    "wasm-pack",
    [
      "build",
      "--release",
      "--out-dir",
      outFullDirPath,
      "--out-name",
      outName,
      "--target",
      "bundler",
      "--mode",
      "no-install",
      "--no-pack",
      "--no-opt",
    ],
    {
      cwd: coreCrateFullDirPath,
      env: {
        ...process.env,
        RUSTFLAGS: "-Ctarget-feature=" + targetFeatures.join(","),
      },
    }
  );
}

function postBuild(outFullDirPath: string, outName: string) {
  console.log(`Post build core... path: ${outFullDirPath}`);
  const currentFullDirPath = process.cwd();
  try {
    process.chdir(outFullDirPath);
    fs.rmSync(".gitignore");
    fs.rmSync(`${outName}.js`);

    const wasmRelFilePath = `${outName}_bg.wasm`;
    run("wasm-opt", [wasmRelFilePath, "-o", wasmRelFilePath, "-O3"]);

    fs.appendFileSync(
      `${outName}_bg.js`,
      `
export function clearCachedMemories() {
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;
}
`
    );

    fs.writeFileSync(
      `${outName}.ts`,
      `/* tslint:disable */
/* eslint-disable */
import * as core_bg from "./core_bg.js";
import { __wbg_set_wasm, clearCachedMemories } from "./core_bg.js";
export function init<T>(module: WebAssembly.Module): T {
    const instance = new WebAssembly.Instance(module, {
        "./core_bg.js": core_bg
    });
    clearCachedMemories();
    const exports = instance.exports;
    __wbg_set_wasm(exports);
    // @ts-ignore
    exports.__wbindgen_start();
    return exports as unknown as T;
}
`
    );

    fs.writeFileSync(
      `${outName}_bg.wasm.d.ts`,
      `/* tslint:disable */
/* eslint-disable */
export {};`
    );
  } finally {
    process.chdir(currentFullDirPath);
  }
}

function deleteBuild(buildFullDirPath: string, wasmName: string) {
  const currentFullDirPath = process.cwd();
  try {
    process.chdir(buildFullDirPath);
    fs.rmSync(`${wasmName}.wasm`, { force: true });
    fs.rmSync(`${wasmName}.wasm.d.ts`, { force: true });
    fs.rmSync(`${wasmName}-bindings.js`, { force: true });
    fs.rmSync(`${wasmName}-bindings.d.ts`, { force: true });
  } finally {
    process.chdir(currentFullDirPath);
  }
}

function copyBuild(srcFullDirPath: string, dstFullDirPath: string) {
  console.log(`Copy build... from: ${srcFullDirPath} to: ${dstFullDirPath}`);
  fs.cpSync(srcFullDirPath, dstFullDirPath, {
    recursive: true,
    force: true,
  });
}

const wasmName = "core";
const buildFullDirPath = path.resolve("src/generated");
rm(buildFullDirPath);
build(buildFullDirPath, wasmName);
postBuild(buildFullDirPath, wasmName);
