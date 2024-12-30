// @vitest-environment node

import { describe, expect, test } from "vitest";
import { graphqlSync, isInitialized, node } from "./index-node.js";

const { initIdempotentlySync } = node;

describe("initialize", () => {
  test("isInitialized", () => {
    expect(isInitialized()).toBe(false);
  });

  test("initIdempotentlySync", async () => {
    expect(initIdempotentlySync()).toBe(undefined);
  });

  test("isInitialized", () => {
    expect(isInitialized()).toBe(true);
  });
});

describe("graphql", () => {
  test("graphqlSync", () => {
    expect(graphqlSync({ schema: {}, source: "" })).toBeTypeOf("object");
  });
});
