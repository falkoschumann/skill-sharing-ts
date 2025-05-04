// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

export interface Talk {
  title: string;
  presenter: string;
  summary: string;
  comments: Comment[];
}

export interface Comment {
  author: string;
  message: string;
}
