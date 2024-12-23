import { spawnSync, SpawnSyncOptions } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function runSync(command: string, args?: string[], options?: SpawnSyncOptions) {
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

const srcGeneratedDir = path.resolve("src/generated");
console.log(`Remove generated directory... path: ${srcGeneratedDir}`);
fs.rmSync(srcGeneratedDir, { recursive: true, force: true });

const coreCrateDir = path.resolve(process.cwd(), "../../crates/core");
console.log(`Build core... path: ${coreCrateDir}`);
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
runSync(
  "wasm-pack",
  [
    "build",
    "--release",
    "--out-dir",
    srcGeneratedDir,
    "--out-name",
    "bindings",
    "--target",
    "web",
    "--mode",
    "no-install",
  ],
  {
    cwd: coreCrateDir,
    env: {
      ...process.env,
      RUSTFLAGS: "-Ctarget-feature=" + targetFeatures.join(","),
    },
  }
);

const distDir = path.resolve("dist");
console.log(`Remove dist... path: ${distDir}`);
fs.rmSync(distDir, { recursive: true, force: true });

const distGeneratedDir = path.resolve(distDir, "generated");
console.log(`Create dist generated... path: ${distGeneratedDir}`);
fs.mkdirSync(distGeneratedDir, { recursive: true });

const wasmSrc = path.resolve("src/generated/bindings_bg.wasm");
const wasmRenamed = path.resolve("src/generated/core.wasm");
console.log(`Rename wasm... from: ${wasmSrc} to: ${wasmRenamed}`);
fs.renameSync(wasmSrc, wasmRenamed);

console.log(`Optimize wasm... path: ${wasmRenamed}`);
runSync("wasm-opt", [wasmRenamed, "-o", wasmRenamed, "-O3"]);

const wasmCopied = path.resolve("dist/generated/core.wasm");
console.log(`Copy wasm... from: ${wasmRenamed} to: ${wasmCopied}"`);
fs.copyFileSync(wasmRenamed, wasmCopied);

const wasmDtsSrc = path.resolve("src/generated/core.wasm.d.ts");
console.log(`Generate d.ts... path: ${wasmDtsSrc}`);
fs.writeFileSync(wasmDtsSrc, "export {};");

const wasmDtsCopied = path.resolve("dist/generated/core.wasm.d.ts");
console.log(`Copy d.ts... from: ${wasmDtsSrc} to: ${wasmDtsCopied}`);
fs.copyFileSync(wasmDtsSrc, wasmDtsCopied);
