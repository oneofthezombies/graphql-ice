import esbuild from "rollup-plugin-esbuild";
import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";

export default defineConfig([
  {
    input: [
      "./src/index.ts",
      "./src/adapter/cloudflare-workers.ts",
      "./src/adapter/node.ts",
    ],
    output: {
      dir: "./dist",
      sourcemap: true,
      preserveModules: true,
    },
    plugins: [esbuild(), typescript()],
    external: ["node:fs", "node:path", "node:url"],
  },
]);
