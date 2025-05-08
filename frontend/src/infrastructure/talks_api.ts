// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import {
  type AddCommentCommand,
  type CommandStatus,
  type DeleteTalkCommand,
  type SubmitTalkCommand,
  type TalksQuery,
  type TalksQueryResult,
} from "../domain/messages";
import { OutputTracker } from "../util/output_tracker";

type FetchType = typeof globalThis.fetch;

const BASE_URL = "/api/talks";

const TALK_SUBMITTED_EVENT = "talk-submitted";
const COMMENT_ADDED_EVENT = "comment-added";
const TALK_DELETED_EVENT = "talk-deleted";

export class TalksApi extends EventTarget {
  static create() {
    return new TalksApi(globalThis.fetch.bind(globalThis));
  }

  static createNull() {
    return new TalksApi(fetchStub as unknown as FetchType);
  }

  readonly #fetch;

  constructor(fetch: FetchType) {
    super();
    this.#fetch = fetch;
  }

  async submitTalk(command: SubmitTalkCommand) {
    const response = await this.#fetch(`${BASE_URL}/submit-talk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(command),
    });
    this.dispatchEvent(
      new CustomEvent(TALK_SUBMITTED_EVENT, { detail: command }),
    );
    const json = (await response.json()) as unknown;
    // TODO validate command status
    return json as CommandStatus;
  }

  trackTalksSubmitted() {
    return OutputTracker.create<SubmitTalkCommand>(this, TALK_SUBMITTED_EVENT);
  }

  async addComment(command: AddCommentCommand) {
    const response = await this.#fetch(`${BASE_URL}/add-comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(command),
    });
    this.dispatchEvent(
      new CustomEvent(COMMENT_ADDED_EVENT, { detail: command }),
    );
    const json = (await response.json()) as unknown;
    // TODO validate command status
    return json as CommandStatus;
  }

  trackCommentsAdded() {
    return OutputTracker.create(this, COMMENT_ADDED_EVENT);
  }

  async deleteTalk(command: DeleteTalkCommand) {
    const response = await this.#fetch(`${BASE_URL}/delete-talk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(command),
    });
    this.dispatchEvent(
      new CustomEvent(TALK_DELETED_EVENT, { detail: command }),
    );
    const json = (await response.json()) as unknown;
    // TODO validate command status
    return json as CommandStatus;
  }

  trackTalksDeleted() {
    return OutputTracker.create(this, TALK_DELETED_EVENT);
  }

  async queryTalks(_query: TalksQuery): Promise<TalksQueryResult> {
    // TODO Replace with server-sent events
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
