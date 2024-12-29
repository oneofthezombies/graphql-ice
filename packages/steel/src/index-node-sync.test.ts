// @vitest-environment node

import { describe, expect, test } from "vitest";
import { graphqlSync, isInitialized } from "./steel.js";
import { initOnceSync } from "./runtime/node.js";

describe("initialize", () => {
  test("isInitialized", () => {
    expect(isInitialized()).toBe(false);
  });

  test("initOnceSync", async () => {
    expect(initOnceSync()).toBe(undefined);
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
