/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { wasm, createServer } from '@graphql-ice/server/adapter/cloudflare-workers';

const server = await createServer(wasm);
export default {
	async fetch(req, env, ctx) {
		const obj = {
			req,
			env,
			ctx,
		};
		console.log(server);
		// console.log(obj);
		return new Response(JSON.stringify(obj));
	},
} as ExportedHandler<Env>;
