// @vitest-environment node

import { describe, expect, test } from "vitest";
import {
  engine,
  EngineAlreadyInitializedError,
  EngineNotInitializedError,
} from "./engine.js";
import { NodeCoreProvider } from "./runtime/node.js";

describe("before initialization", () => {
  test("ping", async () => {
    await expect(engine.ping()).rejects.toThrow(EngineNotInitializedError);
  });
});

describe("initialize", () => {
  test("first init", async () => {
    expect(await engine.init(new NodeCoreProvider())).toBeUndefined();
  });

  test("init after init", async () => {
    await expect(engine.init(new NodeCoreProvider())).rejects.toThrow(
      EngineAlreadyInitializedError
    );
  });

  test("initSync after init", async () => {
    expect(() => engine.initSync(new NodeCoreProvider())).toThrow(
      EngineAlreadyInitializedError
    );
  });
});
