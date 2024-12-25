import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineWorkersConfig({
	plugins: [wasm(), topLevelAwait()],
	test: {
		poolOptions: {
			workers: {
				wrangler: { configPath: './wrangler.toml' },
			},
		},
	},
});
