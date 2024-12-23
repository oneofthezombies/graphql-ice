import { test, expect } from "vitest";
import { createEngine } from "@graphql-ice/engine/adapter/node";

test("ping", async () => {
  const engine = await createEngine();
  const result = await engine.ping();
  expect(result).toBe("pong");
});
