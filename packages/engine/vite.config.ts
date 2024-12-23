import { defineConfig } from "vite";
import typescript from "@rollup/plugin-typescript";
import deletePlugin from "rollup-plugin-delete";
import esbuild from "rollup-plugin-esbuild";
import copy from "rollup-plugin-copy";
import url from "@rollup/plugin-url";

export default defineConfig({
  build: {
    assetsDir: "",
    sourcemap: true,
    minify: false,
    rollupOptions: {
      preserveEntrySignatures: "exports-only",
      input: [
        "./src/index.ts",
        "./src/adapter/cloudflare-workers.ts",
        "./src/adapter/deno-deploy.ts",
        "./src/adapter/node.ts",
        "./src/adapter/vercel-functions-edge.ts",
      ],
      output: {
        dir: "dist",
        format: "esm",
        // preserveModules: true,
        // preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name][extname]",
      },
      plugins: [
        deletePlugin({ targets: "dist/*", runOnce: true }),
        url({
          include: "**/*.wasm",
          limit: 0,
          // fileName: "[dirname][name][extname]",
        }),
        esbuild(),
        typescript(),
        // copy({
        //   targets: [
        //     {
        //       src: "src/generated/*.d.ts",
        //       dest: "dist/generated",
        //     },
        //   ],
        //   hook: "writeBundle",
        // }),
      ],
      external: ["node:fs", "node:path", "node:url"],
    },
  },
});
