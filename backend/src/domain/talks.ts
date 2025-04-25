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
}

export class Comment {
  @IsString()
  author: string;

  @IsString()
  message: string;
}
