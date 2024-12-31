// @vitest-environment node

import { describe, expect, test } from "vitest";
import { graphql, isInitialized, node, triggerPanic } from "./index-node.js";

const { init, initSync } = node;

describe("initialize", () => {
  test("isInitialized", () => {
    expect(isInitialized()).toBe(false);
  });

  test("init", async () => {
    expect(await init()).toBe(undefined);
  });

  test("isInitialized", () => {
    expect(isInitialized()).toBe(true);
  });

  test("init after initialized", async () => {
    expect(await init()).toBe(undefined);
  });

  test("initSync after initialized", async () => {
    expect(initSync()).toBe(undefined);
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
