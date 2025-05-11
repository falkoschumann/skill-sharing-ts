// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import type { Comment, Talk } from "./talks";

export interface SubmitTalkCommand {
  readonly title: string;
  readonly presenter: string;
  readonly summary: string;
}

export interface AddCommentCommand {
  readonly title: string;
  readonly comment: Comment;
}

export interface DeleteTalkCommand {
  readonly title: string;
}

export type CommandStatus = Success | Failure;

export interface Success {
  readonly isSuccess: true;
}

export interface Failure {
  readonly isSuccess: false;
  readonly errorMessage: string;
}

export interface TalksQuery {
  readonly title?: string;
}

export interface TalksQueryResult {
  readonly talks: Talk[];
}
