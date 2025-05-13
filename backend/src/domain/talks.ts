// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";

import * as domain from "@skill-sharing/shared";

export class Talk implements domain.Talk {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  presenter: string;

  @IsString()
  @IsNotEmpty()
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

export class Comment implements domain.Comment {
  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  constructor(author: string, message: string) {
    this.author = author;
    this.message = message;
  }
}
