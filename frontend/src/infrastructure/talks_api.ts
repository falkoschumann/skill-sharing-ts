// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import {
  type AddCommentCommand,
  type DeleteTalkCommand,
  type SubmitTalkCommand,
  type TalksQueryResult,
} from "../domain/messages";
import { type Talk } from "../domain/talks";
import { SseClient } from "./sse_client";
import { OutputTracker } from "../util/output_tracker";

type FetchType = typeof globalThis.fetch;

const BASE_URL = "/api/talks";

const TALK_SUBMITTED_EVENT = "talk-submitted";
const COMMENT_ADDED_EVENT = "comment-added";
const TALK_DELETED_EVENT = "talk-deleted";

export class TalksUpdatedEvent extends Event {
  static TYPE = "talks-updated";

  talks: Talk[];

  constructor(talks: Talk[]) {
    super(TalksUpdatedEvent.TYPE);
    this.talks = talks;
  }
}

export class TalksApi extends EventTarget {
  static create() {
    return new TalksApi(SseClient.create(), globalThis.fetch.bind(globalThis));
  }

  static createNull() {
    return new TalksApi(SseClient.createNull(), fetchStub);
  }

  readonly #talksClient;
  readonly #fetch;

  constructor(talksClient: SseClient, fetch: FetchType) {
    super();
    this.#talksClient = talksClient;
    this.#fetch = fetch;

    this.#talksClient.addEventListener("message", (event) =>
      this.#handleMessage(event as MessageEvent<string>),
    );
  }

  async connect() {
    await this.#talksClient.connect(`${BASE_URL}/events`);
  }

  async close() {
    await this.#talksClient.close();
  }

  simulateMessage(message: string) {
    this.#talksClient.simulateMessage(message);
  }

  async submitTalk(command: SubmitTalkCommand) {
    await this.#fetch(`${BASE_URL}/submit-talk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(command),
    });
    this.dispatchEvent(
      new CustomEvent(TALK_SUBMITTED_EVENT, { detail: command }),
    );
  }

  trackTalksSubmitted() {
    return OutputTracker.create<SubmitTalkCommand>(this, TALK_SUBMITTED_EVENT);
  }

  async addComment(command: AddCommentCommand) {
    await this.#fetch(`${BASE_URL}/add-comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(command),
    });
    this.dispatchEvent(
      new CustomEvent(COMMENT_ADDED_EVENT, { detail: command }),
    );
  }

  trackCommentsAdded() {
    return OutputTracker.create(this, COMMENT_ADDED_EVENT);
  }

  async deleteTalk(command: DeleteTalkCommand) {
    await this.#fetch(`${BASE_URL}/delete-talk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(command),
    });
    this.dispatchEvent(
      new CustomEvent(TALK_DELETED_EVENT, { detail: command }),
    );
  }

  trackTalksDeleted() {
    return OutputTracker.create(this, TALK_DELETED_EVENT);
  }

  #handleMessage(event: MessageEvent<string>) {
    const { talks } = JSON.parse(event.data) as TalksQueryResult;
    this.dispatchEvent(new TalksUpdatedEvent(talks));
  }
}

async function fetchStub() {
  return Promise.resolve(Response.json({ isSuccess: true }));
}
