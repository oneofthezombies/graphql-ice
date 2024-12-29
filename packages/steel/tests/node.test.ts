// @vitest-environment node

import { describe, expect, test } from "vitest";

describe("check node environment", () => {
  test("EdgeRuntime not defined", () => {
    expect(typeof EdgeRuntime).toBe("undefined");
  });
});
