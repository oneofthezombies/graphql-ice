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

async function checkWebAssemblyFeatures() {
	// Step 1: Check SharedArrayBuffer and Atomics in JavaScript
	const sharedArrayBufferSupported = typeof SharedArrayBuffer !== 'undefined';
	const atomicsSupported = typeof Atomics !== 'undefined';

	console.log('SharedArrayBuffer supported:', sharedArrayBufferSupported);
	console.log('Atomics supported:', atomicsSupported);

	if (!sharedArrayBufferSupported || !atomicsSupported) {
		console.log('Environment does not support SharedArrayBuffer or Atomics.');
		return;
	}

	// Step 2: Test WebAssembly Atomics support
	const wasmBinary = new Uint8Array([
		0x00,
		0x61,
		0x73,
		0x6d, // WASM Header
		0x01,
		0x00,
		0x00,
		0x00, // WASM Version
		0x01,
		0x07,
		0x01,
		0x60,
		0x01,
		0x7e,
		0x00, // Type Section
		0x03,
		0x02,
		0x01,
		0x00, // Function Section
		0x05,
		0x03,
		0x01,
		0x00,
		0x01, // Memory Section (shared)
		0x0a,
		0x09,
		0x01,
		0x07,
		0x00,
		0x41,
		0x00,
		0x3f,
		0x00,
		0xfd,
		0x0f,
		0x0b, // Atomic operation
	]);

	try {
		const wasmModule = await WebAssembly.compile(wasmBinary);
		const wasmInstance = await WebAssembly.instantiate(wasmModule, {
			env: {
				memory: new WebAssembly.Memory({
					initial: 1,
					maximum: 1,
					shared: true,
				}),
			},
		});

		console.log('WebAssembly Atomics supported:', true);
	} catch (error) {
		console.log('WebAssembly Atomics supported:', false, error.message);
	}
}

export default {
	async fetch(req, env, ctx): Promise<Response> {
		await checkWebAssemblyFeatures();
		const obj = {
			req,
			env,
			ctx,
		};
		// console.log(obj);
		return new Response(JSON.stringify(obj));
	},
} satisfies ExportedHandler<Env>;
