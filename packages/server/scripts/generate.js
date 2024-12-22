import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function run(command, args, options) {
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

const wasmDistDir = "src";
// fs.rmSync(wasmDistDir, { recursive: true, force: true });
run("cargo", ["build", "--target", "wasm32-unknown-unknown", "--release"], {
  cwd: path.resolve(process.cwd(), "../../crates/server_core"),
  env: {
    ...process.env,
    RUSTFLAGS:
      "-C target-feature=+atomics,+bulk-memory,+exception-handling,+extended-const,+multivalue,+mutable-globals,+nontrapping-fptoint,+reference-types,+relaxed-simd,+sign-ext,+simd128",
  },
});
run("wasm-bindgen", [
  "--out-dir",
  wasmDistDir,
  "--out-name",
  "generated",
  "--target",
  "web",
  path.resolve(
    process.cwd(),
    "../../target/wasm32-unknown-unknown/release/graphql_ice_server_core.wasm"
  ),
]);
