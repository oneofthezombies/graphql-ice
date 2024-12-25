// @vitest-environment node

import { describe, expect, test } from "vitest";
import {
  engine,
  EngineAlreadyInitError,
  EngineNotInitError,
} from "../engine.js";
import { NodeCoreProvider } from "./node.js";

describe("before initialization", () => {
  test("ping", async () => {
    await expect(engine.ping()).rejects.toThrow(EngineNotInitError);
  });
});

describe("initialize", () => {
  test("init", async () => {
    expect(await engine.init(new NodeCoreProvider())).toBeUndefined();
  });

  test("init after init", async () => {
    await expect(engine.init(new NodeCoreProvider())).rejects.toThrow(
      EngineAlreadyInitError
    );
  });

  test("initSync after init", async () => {
    expect(() => engine.initSync(new NodeCoreProvider())).toThrow(
      EngineAlreadyInitError
    );
  });
});

describe("ping", () => {
  test("ping", async () => {
    expect(await engine.ping()).toBe("pong");
  });
});
