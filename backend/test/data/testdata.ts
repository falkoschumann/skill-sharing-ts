// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { Comment, Talk } from "../../src/domain/talks";
import {
  AddCommentCommand,
  DeleteTalkCommand,
  SubmitTalkCommand,
} from "../../src/domain/messages";

export function createTestTalk({
  title = "Talk test title",
  presenter = "Talk test presenter",
  summary = "Talk test summary.",
  comments = [],
} = {}): Talk {
  return { title, presenter, summary, comments };
}

export function createTestTalkWithComment({
  title = "Talk test title",
  presenter = "Talk test presenter",
  summary = "Talk test summary.",
  comments = [createTestComment()],
} = {}): Talk {
  return { title, presenter, summary, comments };
}

export function createTestComment({
  author = "Comment test author",
  message = "Comment test message",
} = {}): Comment {
  return { author, message };
}

export function createTestSubmitTalkCommand({
  title = "Talk test title",
  presenter = "Talk test presenter",
  summary = "Talk test summary.",
} = {}): SubmitTalkCommand {
  return { title, presenter, summary };
}

export function createTestAddCommentCommand({
  title = "Talk test title",
  comment = createTestComment(),
} = {}): AddCommentCommand {
  return { title, comment };
}

export function createTestDeleteTalkCommand({
  title = "Talk test title",
} = {}): DeleteTalkCommand {
  return { title };
}

export function createTestTalksQueryResult({
  talks = [createTestTalk()],
} = {}) {
  return { talks };
}

export function createTestTalksQueryResultWithComment({
  talks = [createTestTalkWithComment()],
} = {}) {
  return { talks };
}
