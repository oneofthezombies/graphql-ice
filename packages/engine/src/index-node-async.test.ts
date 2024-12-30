// @vitest-environment node

import { describe, expect, test } from "vitest";
import { graphql, isInitialized, node, triggerPanic } from "./index-node.js";

const { initIdempotently, initIdempotentlySync } = node;

describe("initialize", () => {
  test("isInitialized", () => {
    expect(isInitialized()).toBe(false);
  });

  test("initIdempotently", async () => {
    expect(await initIdempotently()).toBe(undefined);
  });

  test("isInitialized", () => {
    expect(isInitialized()).toBe(true);
  });

  test("initIdempotently after initialized", async () => {
    expect(await initIdempotently()).toBe(undefined);
  });

  test("initIdempotentlySync after initialized", async () => {
    expect(initIdempotentlySync()).toBe(undefined);
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
