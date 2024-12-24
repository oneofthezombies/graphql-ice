import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    runtime: "edge",
  },
  webpack: (config, { isServer }) => {
    config.experiments.asyncWebAssembly = true;
    config.experiments.syncWebAssembly = true;
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });
    return config;
  },
};

export default nextConfig;
