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
  run("cargo", ["build", "--release", "--target=wasm32-unknown-unknown"], {
    cwd: coreCrateFullDirPath,
    env: {
      ...process.env,
      RUSTFLAGS: "-Ctarget-feature=" + targetFeatures.join(","),
    },
  });
  run("wasm-bindgen", [
    "--out-dir",
    outFullDirPath,
    "--out-name",
    outName,
    "--target",
    "web",
    "--omit-default-module-path",
    "../../target/wasm32-unknown-unknown/release/graphql_ice_core.wasm",
  ]);
}

function postBuild(outFullDirPath: string, outName: string) {
  console.log(`Post build core... path: ${outFullDirPath}`);
  const currentFullDirPath = process.cwd();
  try {
    process.chdir(outFullDirPath);

    const wasmRelFilePath = `${outName}_bg.wasm`;
    run("wasm-opt", [wasmRelFilePath, "-o", wasmRelFilePath, "-O1", "-g"]);

    const lintIgnore = `/* eslint-disable */
// @ts-nocheck
// cSpell:disable
`;
    const jsRelFilePath = `${outName}.js`;
    const jsContent = fs.readFileSync(jsRelFilePath, "utf8");
    fs.writeFileSync(
      jsRelFilePath,
      `${lintIgnore}
${jsContent}`
    );

    const dtsRelFilePath = `${outName}.d.ts`;
    const dtsContent = fs.readFileSync(dtsRelFilePath, "utf8");
    fs.writeFileSync(
      dtsRelFilePath,
      `${lintIgnore}
${dtsContent}`
    );

    fs.writeFileSync(
      `${outName}_bg.wasm.d.ts`,
      `${lintIgnore}
import { Core } from "../engine.js";

export default {} as Core;
export {};

export declare module "@graphql-ice/engine/core.wasm" {
  const core: Core;
  export default core;
}

export declare module "@graphql-ice/engine/core.wasm?module" {
  const core: Core;
  export default core;
}
`
    );
  } finally {
    process.chdir(currentFullDirPath);
  }
}

const Profile = ["debug", "release"] as const;
type Profile = (typeof Profile)[number];
type ArgsResult = {
  profile: Profile;
};
function parseArgs(): ArgsResult {
  const args = process.argv.slice(2);
  let result: ArgsResult = {
    profile: "release",
  };

  const arg0 = args[0];
  if (arg0.startsWith("--")) {
    const profile = arg0.slice(2) as Profile;
    if (Profile.includes(profile)) {
      result.profile = profile;
    }
  }

  return result;
}

function main() {
  const wasmName = "core";
  const buildFullDirPath = path.resolve("src/generated");
  rm(buildFullDirPath);
  build(buildFullDirPath, wasmName);
  postBuild(buildFullDirPath, wasmName);
}

main();
