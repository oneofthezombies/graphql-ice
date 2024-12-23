import esbuild from "rollup-plugin-esbuild";
import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import url from "@rollup/plugin-url";
import resolve from "@rollup/plugin-node-resolve";
import deletePlugin from "rollup-plugin-delete";

export default defineConfig([
  {
    input: {
      server: "./src/server.ts",
      "adapter/cloudflare-workers": "./src/adapter/cloudflare-workers.ts",
      "adapter/node": "./src/adapter/node.ts",
    },
    output: {
      dir: "dist",
      sourcemap: true,
      format: "esm",
      // entryFileNames: "[name].js",
      // chunkFileNames: "[name]-[hash].js",
      assetFileNames: "[name][extname]",
      preserveModules: true,
    },
    plugins: [
      deletePlugin({ targets: "dist/*", runOnce: true }),
      resolve(),
      url({
        include: ["**/*.wasm"],
        limit: 0,
        fileName: "[name][extname]",
      }),
      esbuild(),
      typescript(),
    ],
    external: ["node:fs", "node:path", "node:url"],
  },
]);
