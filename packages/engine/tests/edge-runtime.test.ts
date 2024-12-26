/// <reference types="@edge-runtime/types" />
// @vitest-environment edge-runtime

import { describe, expect, test } from "vitest";

describe("check edge-runtime environment", () => {
  test("EdgeRuntime defined", () => {
    expect(EdgeRuntime).toBeDefined();
  });
});
