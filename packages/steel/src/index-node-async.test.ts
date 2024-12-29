// @vitest-environment node

import { describe, expect, test } from "vitest";
import { graphql, isInitialized, triggerPanic } from "./steel.js";
import { initOnce, initOnceSync } from "./runtime/node.js";

describe("initialize", () => {
  test("isInitialized", () => {
    expect(isInitialized()).toBe(false);
  });

  test("initOnce", async () => {
    expect(await initOnce()).toBe(undefined);
  });

  test("isInitialized", () => {
    expect(isInitialized()).toBe(true);
  });

  test("initOnce after initialized", async () => {
    expect(await initOnce()).toBe(undefined);
  });

  test("initOnceSync after initialized", async () => {
    expect(initOnceSync()).toBe(undefined);
  });
});

describe("graphql", () => {
  test("graphql", async () => {
    expect(await graphql({ schema: {}, source: "" })).toBeTypeOf("object");
  });

  test("triggerPanic", () => {
    expect(() => triggerPanic()).toThrow("unreachable");
  });
});
