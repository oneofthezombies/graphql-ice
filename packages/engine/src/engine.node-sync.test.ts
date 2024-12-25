// @vitest-environment node

import { describe, expect, test } from "vitest";
import { engine, EngineAlreadyInitializedError } from "./engine.js";
import { NodeCoreProvider } from "./runtime/node.js";

describe("initialize", () => {
  test("initSync", async () => {
    expect(engine.initSync(new NodeCoreProvider())).toBeUndefined();
  });

  test("initSync after initSync", async () => {
    expect(() => engine.initSync(new NodeCoreProvider())).toThrow(
      EngineAlreadyInitializedError
    );
  });

  test("init after initSync", async () => {
    await expect(engine.init(new NodeCoreProvider())).rejects.toThrow(
      EngineAlreadyInitializedError
    );
  });
});
