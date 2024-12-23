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
    target: "esnext",
    rollupOptions: {
      preserveEntrySignatures: "strict",
      input: ["./src/graphql.ts", "./src/ping.ts"],
      output: {
        dir: "api",
        format: "esm",
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[dir]/[name][extname]",
        // assetFileNames: (info) => {
        //   return info.originalFileNames[0].replace(/^src\//, "");
        // },
      },
      plugins: [
        deletePlugin({ targets: "api/*", runOnce: true }),
        esbuild({
          target: "esnext",
        }),
        typescript(),
        copy({
          targets: [
            {
              src: "src/generated/*.d.ts",
              dest: "api/generated",
            },
          ],
          hook: "writeBundle",
        }),
      ],
      external: ["node:fs", "node:path", "node:url"],
    },
  },
});
