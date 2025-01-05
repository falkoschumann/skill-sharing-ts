// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import {
  AddCommentCommand,
  CommandStatus,
  DeleteTalkCommand,
  SubmitTalkCommand,
} from '../application/messages.ts';
import { Talk } from '../domain/talks.ts';
import { OutputTracker } from '../util/output_tracker.ts';
import { SseClient } from './sse_client.ts';

export const TALK_SUBMITTED_EVENT = 'talk-submitted';
export const TALK_DELETED_EVENT = 'talk-deleted';
export const COMMENT_ADDED_EVENT = 'comment-added';

export class TalksUpdatedEvent extends Event {
  static TYPE = 'talks-updated';

  constructor(public readonly talks: Talk[]) {
    super(TalksUpdatedEvent.TYPE);
  }
}

const BASE_URL = '/api/talks';

export class TalksApi extends EventTarget {
  static create() {
    return new TalksApi(SseClient.create(), globalThis.fetch);
  }

  static createNull() {
    return new TalksApi(
      SseClient.createNull(),
      fetchStub as unknown as typeof globalThis.fetch,
    );
  }

  readonly #talksClient;
  readonly #fetch;

  constructor(talksClient: SseClient, fetch: typeof globalThis.fetch) {
    super();
    this.#talksClient = talksClient;
    this.#fetch = fetch;

    this.#talksClient.addEventListener(
      'message',
      (event) => this.#handleMessage(event as MessageEvent),
    );
  }

  async connect() {
    await this.#talksClient.connect(BASE_URL);
  }

  async close() {
    await this.#talksClient.close();
  }

  async submitTalk(command: SubmitTalkCommand): Promise<CommandStatus> {
    const body = JSON.stringify(command);
    await this.#fetch(`${BASE_URL}/${encodeURIComponent(command.title)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    this.dispatchEvent(
      new CustomEvent<SubmitTalkCommand>(TALK_SUBMITTED_EVENT, {
        detail: command,
      }),
    );
    return CommandStatus.success();
  }

  trackTalksSubmitted() {
    return new OutputTracker<SubmitTalkCommand>(this, TALK_SUBMITTED_EVENT);
  }

  async addComment(command: AddCommentCommand) {
    const body = JSON.stringify(command.comment);
    await this.#fetch(
      `${BASE_URL}/${encodeURIComponent(command.title)}/comments`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      },
    );
    this.dispatchEvent(
      new CustomEvent<AddCommentCommand>(COMMENT_ADDED_EVENT, {
        detail: command,
      }),
    );
  }

  trackCommentsAdded() {
    return OutputTracker.create<AddCommentCommand>(this, COMMENT_ADDED_EVENT);
  }

  async deleteTalk(command: DeleteTalkCommand) {
    await this.#fetch(`${BASE_URL}/${encodeURIComponent(command.title)}`, {
      method: 'DELETE',
    });
    this.dispatchEvent(
      new CustomEvent<DeleteTalkCommand>(TALK_DELETED_EVENT, {
        detail: command,
      }),
    );
  }

  trackTalksDeleted() {
    return OutputTracker.create<DeleteTalkCommand>(this, TALK_DELETED_EVENT);
  }

  #handleMessage(event: MessageEvent) {
    const talks = JSON.parse(event.data);
    this.dispatchEvent(new TalksUpdatedEvent(talks));
  }
}

function fetchStub() {
  return Promise.resolve();
}
