// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

import * as domain from "@skill-sharing/shared";
import { Comment, Talk } from "./talks";

export class SubmitTalkCommand implements domain.SubmitTalkCommand {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  presenter: string;

  @IsString()
  @IsNotEmpty()
  summary: string;

  constructor(title: string, presenter: string, summary: string) {
    this.title = title;
    this.presenter = presenter;
    this.summary = summary;
  }
}

export class AddCommentCommand implements domain.AddCommentCommand {
  @IsString()
  @IsNotEmpty()
  title: string;

  @ValidateNested()
  @Type(() => Comment)
  comment: Comment;

  constructor(title: string, comment: Comment) {
    this.title = title;
    this.comment = comment;
  }
}

export class DeleteTalkCommand implements domain.DeleteTalkCommand {
  @IsString()
  @IsNotEmpty()
  title: string;

  constructor(title: string) {
    this.title = title;
  }
}

export type CommandStatus = Success | Failure;

export class Success implements domain.Success {
  readonly isSuccess = true;
}

export class Failure implements domain.Failure {
  readonly isSuccess = false;
  readonly errorMessage: string;

  constructor(errorMessage: string) {
    this.errorMessage = errorMessage;
  }
}

export class TalksQuery implements domain.TalksQuery {
  @IsOptional()
  @IsString()
  title?: string;

  constructor(title: string) {
    this.title = title;
  }
}

export class TalksQueryResult implements domain.TalksQueryResult {
  @IsArray()
  @ValidateNested()
  @Type(() => Talk)
  talks: Talk[];

  constructor(talks: Talk[]) {
    this.talks = talks;
  }
}
