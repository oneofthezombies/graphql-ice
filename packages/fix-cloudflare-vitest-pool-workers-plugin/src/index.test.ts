import { describe, expect, test } from "vitest";
import fixCloudflareVitestPoolWorkers from "./index.js";
import { PluginContext, ResolveIdResult } from "rollup";
import { Plugin } from "vitest/config";

export function parseResolveId(
  plugin: Plugin
): (source: string) => Promise<ResolveIdResult> {
  return async (source: string) => {
    if (!plugin.resolveId) {
      throw new Error("resolveId is exist");
    }
    if (typeof plugin.resolveId !== "function") {
      throw new Error("resolveId is function");
    }
    const result = await plugin.resolveId.bind({} as PluginContext)(
      source,
      undefined,
      {
        attributes: {},
        isEntry: false,
      }
    );
    return result;
  };
}

test("resolveId", async () => {
  expect(fixCloudflareVitestPoolWorkers().resolveId).not.toBeUndefined();
});

describe("fix-fs", () => {
  const resolveId = parseResolveId(fixCloudflareVitestPoolWorkers());

  test("../../../../@fs/test.wasm", async () => {
    expect(await resolveId("../../../../@fs/test.wasm")).toBe("/test.wasm");
  });

  test("../../../../@fs/directory/test.wasm", async () => {
    expect(await resolveId("../../../../@fs/directory/test.wasm")).toBe(
      "/directory/test.wasm"
    );
  });

  test("../../../../@fs/test.wasm?module", async () => {
    expect(await resolveId("../../../../@fs/test.wasm?module")).toBe(
      "/test.wasm"
    );
  });

  test("../../../../@fs/directory/test.wasm?module", async () => {
    expect(await resolveId("../../../../@fs/directory/test.wasm?module")).toBe(
      "/directory/test.wasm"
    );
  });

  test("/@fs/test.wasm", async () => {
    expect(await resolveId("/@fs/test.wasm")).toBe(undefined);
  });

  test("/@fs/directory/test.wasm", async () => {
    expect(await resolveId("/@fs/directory/test.wasm")).toBe(undefined);
  });
});
