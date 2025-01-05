// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import { Comment, Talk } from '../domain/talks.ts';

export type SubmitTalkCommand = {
  title: string;
  presenter: string;
  summary: string;
};

export type AddCommentCommand = {
  title: string;
  comment: Comment;
};

export type DeleteTalkCommand = {
  title: string;
};

export type TalksQuery = {
  title?: string;
};

export type TalksQueryResult = {
  talks: Talk[];
};

/**
 * The status returned by a command handler.
 */
export class CommandStatus {
  /**
   * Creates a successful status.
   */
  static success(): CommandStatus {
    return new CommandStatus(true);
  }

  /**
   * Creates a failed status.
   */
  static failure(errorMessage: string): CommandStatus {
    return new CommandStatus(false, errorMessage);
  }

  /**
   * Creates a new instance of CommandStatus.
   *
   * @param success Indicates whether the command was successful.
   * @param errorMessage The error message if the command failed.
   */
  constructor(
    public readonly success: boolean,
    public readonly errorMessage?: string,
  ) {
  }
}
