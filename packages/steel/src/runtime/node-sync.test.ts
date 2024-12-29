// @vitest-environment node

import { describe, expect, test } from "vitest";
import { Engine, EngineAlreadyInitError } from "../engine.js";
import { NodeAdapter } from "./node.js";

describe("initialize", () => {
  test("initSync", async () => {
    expect(Engine.initSync({ adapter: new NodeAdapter() })).toBeTypeOf(
      "object"
    );
  });

  test("initSync after initSync", async () => {
    expect(() => Engine.initSync({ adapter: new NodeAdapter() })).toThrow(
      EngineAlreadyInitError
    );
  });

  test("init after initSync", async () => {
    await expect(Engine.init({ adapter: new NodeAdapter() })).rejects.toThrow(
      EngineAlreadyInitError
    );
  });
});

describe("graphql", () => {
  test("graphqlSync", () => {
    expect(Engine.get().graphqlSync({ schema: {}, source: "" })).toBeTypeOf(
      "object"
    );
  });
});
