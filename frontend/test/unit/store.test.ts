// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { createStore } from "../../src/application/store";
import { queryTalks, selectTalks } from "../../src/application/talks_slice";
import { TalksApi } from "../../src/infrastructure/talks_api";
import { createTestTalk } from "../data/testdata";

describe("Store", () => {
  describe("Talks", () => {
    it("Lists all talks", async () => {
      const { store } = configure();

      await store.dispatch(queryTalks({}));

      expect(selectTalks(store.getState())).toEqual([createTestTalk()]);
    });
  });
});

function configure() {
  const api = TalksApi.createNull();
  const store = createStore(api);
  return { store, api };
}
