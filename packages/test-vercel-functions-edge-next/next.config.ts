import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    config.experiments.asyncWebAssembly = true;
    config.externals.push("wbg");
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });
    console.log(config);
    return config;
  },
};

export default nextConfig;
