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
    const stderrString = stderr.toString().trim();
    throw new Error(
      `${commandLine} failed. status: ${status}` +
        (stderrString.length > 0 ? ` stderr: ${stderrString}` : "")
    );
  }
}

function rm(path: string) {
  console.log(`Delete... path: ${path}`);
  fs.rmSync(path, { recursive: true, force: true });
}

function build(outFullDirPath: string, outName: string) {
  const coreCrateFullDirPath = path.resolve(process.cwd(), "../../crates/core");
  console.log(`Build core... path: ${coreCrateFullDirPath}`);
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
      "web",
      "--mode",
      "no-install",
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
    fs.rmSync("package.json");
    fs.renameSync(`${outName}.js`, `${outName}-bindings.js`);
    fs.renameSync(`${outName}.d.ts`, `${outName}-bindings.d.ts`);
    const wasmSrc = `${outName}_bg.wasm`;
    run("wasm-opt", [wasmSrc, "-o", `${outName}.wasm`, "-O3"]);
    fs.rmSync(wasmSrc);
    fs.rmSync(`${outName}_bg.wasm.d.ts`);
    fs.writeFileSync(`${outName}.wasm.d.ts`, "export {};");
  } finally {
    process.chdir(currentFullDirPath);
  }
}

function copyBuild(srcFullDirPath: string, dstFullDirPath: string) {
  console.log(`Copy build from: ${srcFullDirPath} to: ${dstFullDirPath}`);
  fs.cpSync(srcFullDirPath, dstFullDirPath, {
    recursive: true,
    force: true,
  });
}

const srcGeneratedFullDirPath = path.resolve("src/generated");
const wasmName = "core";
const distFullDirPath = path.resolve("dist");
const dstGeneratedFullDirPath = path.resolve(distFullDirPath, "generated");
rm(srcGeneratedFullDirPath);
build(srcGeneratedFullDirPath, wasmName);
postBuild(srcGeneratedFullDirPath, wasmName);
rm(distFullDirPath);
copyBuild(srcGeneratedFullDirPath, dstGeneratedFullDirPath);
