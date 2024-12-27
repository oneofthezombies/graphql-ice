import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';
import fixCloudflareVitestPoolWorkers from '@graphql-ice/fix-cloudflare-vitest-pool-workers-plugin';

export default defineWorkersConfig({
	plugins: [fixCloudflareVitestPoolWorkers()],
	test: {
		poolOptions: {
			workers: {
				wrangler: { configPath: 'wrangler.toml' },
			},
		},
	},
});
