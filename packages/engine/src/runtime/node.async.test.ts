// @vitest-environment node

import { describe, expect, test } from "vitest";
import {
  Engine,
  EngineAlreadyInitError,
  EngineNotInitError,
} from "../engine.js";
import { NodeAdapter } from "./node.js";

describe("initialize", () => {
  test("Engine.get", () => {
    expect(() => Engine.get()).toThrow(EngineNotInitError);
  });

  test("Engine.init", async () => {
    expect(await Engine.init({ adapter: new NodeAdapter() })).toBeTypeOf(
      "object"
    );
  });

  test("Engine.isInitialized", () => {
    expect(Engine.isInitialized).toBe(true);
  });

  test("init after init", async () => {
    await expect(Engine.init({ adapter: new NodeAdapter() })).rejects.toThrow(
      EngineAlreadyInitError
    );
  });

  test("initSync after init", async () => {
    expect(() => Engine.initSync({ adapter: new NodeAdapter() })).toThrow(
      EngineAlreadyInitError
    );
  });
});
