import { defineConfig } from "vite";
import typescript from "@rollup/plugin-typescript";
import deletePlugin from "rollup-plugin-delete";
import esbuild from "rollup-plugin-esbuild";
import copy from "rollup-plugin-copy";

export default defineConfig({
  build: {
    assetsDir: "",
    sourcemap: true,
    minify: false,
    rollupOptions: {
      preserveEntrySignatures: "strict",
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
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: (info) => {
          return info.originalFileNames[0].replace(/^src\//, "");
        },
      },
      plugins: [
        deletePlugin({ targets: "dist/*", runOnce: true }),
        esbuild(),
        typescript(),
        copy({
          targets: [
            {
              src: "src/generated/*.d.ts",
              dest: "dist/generated",
            },
          ],
          hook: "writeBundle",
        }),
      ],
      external: ["node:fs", "node:path", "node:url"],
    },
  },
});
