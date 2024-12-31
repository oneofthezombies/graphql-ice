// @vitest-environment node

import { describe, expect, test } from "vitest";
import { graphqlSync, isInitialized, node } from "./index-node.js";

const { initSync } = node;

describe("initialize", () => {
  test("isInitialized", () => {
    expect(isInitialized()).toBe(false);
  });

  test("initSync", async () => {
    expect(initSync()).toBe(undefined);
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
