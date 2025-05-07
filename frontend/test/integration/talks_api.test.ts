// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { TalksApi } from "../../src/infrastructure/talks_api";
import { createTestTalk } from "../data/testdata";

describe("Talks API", () => {
  it("Submits talk", async () => {
    const { api } = configure();
    const talksPut = api.trackTalksSubmitted();

    await api.submitTalk({
      title: "title-1",
      presenter: "presenter-1",
      summary: "summary-1",
    });

    expect(talksPut.data).toEqual([
      { title: "title-1", presenter: "presenter-1", summary: "summary-1" },
    ]);
  });

  it("Add comment", async () => {
    const { api } = configure();
    const commentsAdded = api.trackCommentsAdded();

    await api.addComment({
      title: "title-1",
      comment: {
        author: "author-1",
        message: "message-1",
      },
    });

    expect(commentsAdded.data).toEqual([
      {
        title: "title-1",
        comment: { author: "author-1", message: "message-1" },
      },
    ]);
  });

  it("Query talks", async () => {
    const api = TalksApi.createNull();

    const result = await api.queryTalks({});

    expect(result).toEqual({
      talks: [createTestTalk()],
    });
  });
});

function configure() {
  const api = TalksApi.createNull();
  return { api };
}
