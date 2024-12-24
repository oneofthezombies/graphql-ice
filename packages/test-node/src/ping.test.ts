import { test, expect } from "vitest";
import { createEngine } from "@graphql-ice/engine/adapter/node";

const engine = await createEngine();

test("ping", async () => {
  const result = await engine.ping();
  expect(result).toBe("pong");
});
