import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";
import fixCloudflareVitestPoolWorkers from "@graphql-steel/fix-cloudflare-vitest-pool-workers-plugin";

const configPath = process.env.STEEL_WRANGLER_CONFIG_PATH ?? "wrangler.toml";

export default defineWorkersConfig({
  plugins: [fixCloudflareVitestPoolWorkers()],
  test: {
    poolOptions: {
      workers: { wrangler: { configPath } },
    },
  },
});
