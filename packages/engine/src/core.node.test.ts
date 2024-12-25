// @vitest-environment node

import { expect, test } from "vitest";

test("check node environment", () => {
  expect(typeof EdgeRuntime).toBe("undefined");
});
