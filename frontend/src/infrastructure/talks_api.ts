// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import {
  createSuccess,
  type SubmitTalkCommand,
  type TalksQuery,
  type TalksQueryResult,
} from "../domain/messages";
import { OutputTracker } from "../util/output_tracker";

type FetchType = typeof globalThis.fetch;

const BASE_URL = "/api/talks";

const TALK_SUBMITTED_EVENT = "talk-submitted";

export class TalksApi extends EventTarget {
  static create() {
    return new TalksApi(globalThis.fetch.bind(globalThis));
  }

  static createNull() {
    return new TalksApi(fetchStub as unknown as FetchType);
  }

  #fetch;

  constructor(fetch: FetchType) {
    super();
    this.#fetch = fetch;
  }

  async submitTalk(command: SubmitTalkCommand) {
    // TODO validate command status
    const body = JSON.stringify(command);
    await this.#fetch(`${BASE_URL}/${encodeURIComponent(command.title)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body,
    });
    this.dispatchEvent(
      new CustomEvent(TALK_SUBMITTED_EVENT, {
        detail: command,
      }),
    );
    return createSuccess();
  }

  trackTalksSubmitted() {
    return OutputTracker.create<SubmitTalkCommand>(this, TALK_SUBMITTED_EVENT);
  }

  async queryTalks(_query: TalksQuery): Promise<TalksQueryResult> {
    const response = await this.#fetch("/api/talks/query-talks");
    const result: unknown = await response.json();
    return result as TalksQueryResult;
  }
}

async function fetchStub() {
  return Promise.resolve({
    json: () => ({
      talks: [
        {
          title: "Talk test title",
          presenter: "Talk test presenter",
          summary: "Talk test summary.",
          comments: [],
        },
      ],
    }),
  });
}
