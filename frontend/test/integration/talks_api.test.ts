// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { SseClient } from "@skill-sharing/shared";
import { TalksApi } from "../../src/infrastructure/talks_api";
import { createTestTalk } from "../data/testdata";

describe("Talks API", () => {
  it("Query talks", async () => {
    const { api, sseClient } = configure();
    const events: Event[] = [];
    const result = new Promise<void>((resolve) =>
      sseClient.addEventListener("message", () => resolve()),
    );
    api.addEventListener("talks-updated", (event) => events.push(event));

    await api.connect();
    sseClient.simulateMessage(JSON.stringify({ talks: [createTestTalk()] }));
    await result;
    await api.close();

    expect(events).toEqual([
      expect.objectContaining({
        talks: [createTestTalk()],
      }),
    ]);
  });

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

  it("Adds comment", async () => {
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

  it("Deletes talk", async () => {
    const { api } = configure();
    const talksDeleted = api.trackTalksDeleted();

    await api.deleteTalk({ title: "title-1" });

    expect(talksDeleted.data).toEqual([{ title: "title-1" }]);
  });
});

function configure() {
  const sseClient = SseClient.createNull();
  const api = new TalksApi(sseClient, () =>
    Promise.resolve(Response.json({ isSuccess: true })),
  );
  return { api, sseClient };
}
