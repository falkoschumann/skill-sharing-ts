// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

export interface Talk {
  readonly title: string;
  readonly presenter: string;
  readonly summary: string;
  readonly comments: Comment[];
}

export interface Comment {
  readonly author: string;
  readonly message: string;
}
