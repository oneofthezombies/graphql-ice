import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';
import { Plugin } from 'vitest/config.js';

import path from 'node:path';

function cloudflareVitestPoolWorkersFix() {
	const WINDOWS_VOLUME_RE = /^[A-Z]:/i;
	const WINDOWS_SLASH_RE = /\\/g;
	const FS_PREFIX = `/@fs/`;
	const isWindows = typeof process !== 'undefined' && process.platform === 'win32';
	function slash(p: string) {
		return p.replace(WINDOWS_SLASH_RE, '/');
	}
	function normalizePath(id: string) {
		return path.posix.normalize(isWindows ? slash(id) : id);
	}
	function fsPathFromId(id: string) {
		const fsPath = normalizePath(id.startsWith(FS_PREFIX) ? id.slice(FS_PREFIX.length) : id);
		return fsPath[0] === '/' || WINDOWS_VOLUME_RE.test(fsPath) ? fsPath : `/${fsPath}`;
	}

	return {
		name: 'cloudflare-vitest-pool-workers-fix',
		resolveId(id) {
			if (id.includes('/@fs/') && !id.startsWith('/@fs/')) {
				const url = new URL(id, 'http://placeholder');
				return fsPathFromId(url.pathname);
			}
		},
	} satisfies Plugin;
}

export default defineWorkersConfig({
	plugins: [cloudflareVitestPoolWorkersFix()],
	test: {
		poolOptions: {
			workers: {
				wrangler: { configPath: './wrangler.toml' },
			},
		},
	},
});
