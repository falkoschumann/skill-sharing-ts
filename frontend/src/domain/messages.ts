// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import type { Talk } from "./talks";

export interface SubmitTalkCommand {
  title: string;
  presenter: string;
  summary: string;
}

export type CommandStatus = Success | Failure;

export interface Success {
  isSuccess: true;
}

export interface Failure {
  isSuccess: false;
  errorMessage: string;
}

export function createSuccess(): Success {
  return { isSuccess: true };
}

export function createFailure(errorMessage: string): Failure {
  return { isSuccess: false, errorMessage };
}

export interface TalksQuery {
  title?: string;
}

export interface TalksQueryResult {
  talks: Talk[];
}
