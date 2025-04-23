// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

export function createTestTalk({
  title = 'Talk test title',
  presenter = 'Talk test presenter',
  summary = 'Talk test summary.',
  comments = [],
} = {}) {
  return { title, presenter, summary, comments };
}

export function createTestTalkWithComment({
  title = 'Talk test title',
  presenter = 'Talk test presenter',
  summary = 'Talk test summary.',
  comments = [createTestComment()],
} = {}) {
  return { title, presenter, summary, comments };
}

export function createTestComment({
  author = 'Comment test author',
  message = 'Comment test message',
} = {}) {
  return { author, message };
}
