import { spawnSync, SpawnSyncOptions } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function run(command: string, args?: string[], options?: SpawnSyncOptions) {
  args ??= [];
  options ??= {};
  if (!options.stdio) {
    options.stdio = "inherit";
  }
  const result = spawnSync(command, args, options);
  if (result.status !== 0) {
    throw new Error(command + args.join(" ") + " failed.");
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
run("cargo", ["build", "--target", "wasm32-unknown-unknown", "--release"], {
  cwd: coreCrateDir,
  env: {
    ...process.env,
    RUSTFLAGS: "-Ctarget-feature=" + targetFeatures.join(","),
  },
});

console.log(`Generate bindings... path: ${srcGeneratedDir}`);
run("wasm-bindgen", [
  "--out-dir",
  srcGeneratedDir,
  "--out-name",
  "bindings",
  "--target",
  "web",
  path.resolve(
    process.cwd(),
    "../../target/wasm32-unknown-unknown/release/graphql_ice_core.wasm"
  ),
]);

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
run("wasm-opt", [wasmRenamed, "-o", wasmRenamed, "-O3"]);

const wasmCopied = path.resolve("dist/generated/core.wasm");
console.log(`Copy wasm... from: ${wasmRenamed} to: ${wasmCopied}"`);
fs.copyFileSync(wasmRenamed, wasmCopied);

const wasmDtsSrc = path.resolve("src/generated/core.wasm.d.ts");
console.log(`Generate d.ts... path: ${wasmDtsSrc}`);
fs.writeFileSync(wasmDtsSrc, "export {};");

const wasmDtsCopied = path.resolve("dist/generated/core.wasm.d.ts");
console.log(`Copy d.ts... from: ${wasmDtsSrc} to: ${wasmDtsCopied}`);
fs.copyFileSync(wasmDtsSrc, wasmDtsCopied);
