import { defineConfig, Plugin } from "vite";
import deletePlugin from "rollup-plugin-delete";
import typescript from "vite-plugin-typescript";
import copy from "rollup-plugin-copy";

const isTest = process.env.MODE === "test";

export default defineConfig({
  plugins: [
    isTest && deletePlugin({ targets: "dist/*", runOnce: true }),
    copy({
      targets: [
        {
          src: "src/generated/*.d.ts",
          dest: "dist/generated",
        },
      ],
      hook: "writeBundle",
    }),
    typescript({
      tsconfig: "tsconfig.json",
    }),
  ].filter(Boolean),
  build: {
    target: "esnext",
    sourcemap: true,
    minify: false,
    rollupOptions: {
      preserveEntrySignatures: "exports-only",
      input: ["./src/index.ts", "./src/runtime/node.ts"],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        dir: "dist",
        format: "es",
        entryFileNames: "[name].js",
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: (info) => {
          if (info.names[0] === "core_bg.wasm") {
            return info.originalFileNames[0].replace(/^src\//, "");
          }
          return "[name][extname]";
        },
      },
      external: ["node:fs", "node:path", "node:url"],
    },
  },
});
