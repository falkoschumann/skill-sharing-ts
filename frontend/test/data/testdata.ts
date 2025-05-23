// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import type { Comment, Talk } from "@skill-sharing/shared";
import type { User } from "../../src/domain/users";

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

export function createTestUser({ username = "User test username" } = {}): User {
  return { username };
}
