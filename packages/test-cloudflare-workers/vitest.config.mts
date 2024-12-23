import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';
import wasm from 'vite-plugin-wasm';

export default defineWorkersConfig({
	plugins: [wasm()],
	test: {
		poolOptions: {
			workers: {
				wrangler: { configPath: './wrangler.toml' },
			},
		},
	},
});
