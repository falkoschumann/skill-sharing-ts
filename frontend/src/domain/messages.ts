// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import type { Talk } from "./talks";

export interface SubmitTalkCommand {
  readonly title: string;
  readonly presenter: string;
  readonly summary: string;
}

export type CommandStatus = Success | Failure;

export interface Success {
  readonly isSuccess: true;
}

export interface Failure {
  readonly isSuccess: false;
  readonly errorMessage: string;
}

export function createSuccess(): Success {
  return { isSuccess: true };
}

export function createFailure(errorMessage: string): Failure {
  return { isSuccess: false, errorMessage };
}

export interface TalksQuery {
  readonly title?: string;
}

export interface TalksQueryResult {
  readonly talks: Talk[];
}
