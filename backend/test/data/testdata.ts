// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { Comment, Talk } from "../../src/domain/talks";
import {
  AddCommentCommand,
  DeleteTalkCommand,
  SubmitTalkCommand,
  TalksQueryResult,
} from "../../src/domain/messages";

export function createTestTalk({
  title = "Talk test title",
  presenter = "Talk test presenter",
  summary = "Talk test summary.",
  comments = [],
} = {}) {
  return new Talk(title, presenter, summary, comments);
}

export function createTestTalkWithComment({
  title = "Talk test title",
  presenter = "Talk test presenter",
  summary = "Talk test summary.",
  comments = [createTestComment()],
} = {}) {
  return new Talk(title, presenter, summary, comments);
}

export function createTestComment({
  author = "Comment test author",
  message = "Comment test message",
} = {}) {
  return new Comment(author, message);
}

export function createTestSubmitTalkCommand({
  title = "Talk test title",
  presenter = "Talk test presenter",
  summary = "Talk test summary.",
} = {}) {
  return new SubmitTalkCommand(title, presenter, summary);
}

export function createTestAddCommentCommand({
  title = "Talk test title",
  comment = createTestComment(),
} = {}) {
  return new AddCommentCommand(title, comment);
}

export function createTestDeleteTalkCommand({
  title = "Talk test title",
} = {}) {
  return new DeleteTalkCommand(title);
}

export function createTestTalksQueryResult({
  talks = [createTestTalk()],
} = {}) {
  return new TalksQueryResult(talks);
}

export function createTestTalksQueryResultWithComment({
  talks = [createTestTalkWithComment()],
} = {}) {
  return new TalksQueryResult(talks);
}
