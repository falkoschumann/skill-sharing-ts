// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { TalksApi } from "../../src/infrastructure/talks_api";
import { createTestTalk } from "../data/testdata";

describe("API", () => {
  it("Query talks", async () => {
    const api = TalksApi.createNull();

    const result = await api.queryTalks({});

    expect(result).toEqual({
      talks: [createTestTalk()],
    });
  });
});
