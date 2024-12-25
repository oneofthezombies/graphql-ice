// @vitest-environment node

import { describe, expect, test } from "vitest";
import { engine, EngineAlreadyInitError } from "../engine.js";
import { NodeCoreProvider } from "./node.js";

describe("initialize", () => {
  test("initSync", async () => {
    expect(engine.initSync(new NodeCoreProvider())).toBeUndefined();
  });

  test("initSync after initSync", async () => {
    expect(() => engine.initSync(new NodeCoreProvider())).toThrow(
      EngineAlreadyInitError
    );
  });

  test("init after initSync", async () => {
    await expect(engine.init(new NodeCoreProvider())).rejects.toThrow(
      EngineAlreadyInitError
    );
  });
});

describe("ping", () => {
  test("ping", async () => {
    expect(await engine.ping()).toBe("pong");
  });
});
