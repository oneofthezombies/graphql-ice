/// <reference types="@edge-runtime/types" />
// @vitest-environment edge-runtime

import { expect, test } from "vitest";

test("check edge environment", () => {
  expect(EdgeRuntime).toBe("edge-runtime");
});
