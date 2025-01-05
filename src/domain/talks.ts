// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

export type Talk = {
  title: string;
  presenter: string;
  summary: string;
  comments: Comment[];
};

export type Comment = {
  author: string;
  message: string;
};
