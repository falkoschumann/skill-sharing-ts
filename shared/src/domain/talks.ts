// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { Type } from "class-transformer";
import { IsArray, IsString, ValidateNested } from "class-validator";

export class Talk {
  @IsString()
  title: string;

  @IsString()
  presenter: string;

  @IsString()
  summary: string;

  @IsArray()
  @ValidateNested()
  @Type(() => Comment)
  comments: Comment[];

  constructor(
    title: string,
    presenter: string,
    summary: string,
    comments: Comment[],
  ) {
    this.title = title;
    this.presenter = presenter;
    this.summary = summary;
    this.comments = comments;
  }
}

export class Comment {
  @IsString()
  author: string;

  @IsString()
  message: string;

  constructor(author: string, message: string) {
    this.author = author;
    this.message = message;
  }
}
