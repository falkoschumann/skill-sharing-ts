// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";

import { Talk } from "./talks";

export class TalksQuery {
  @IsOptional()
  @IsString()
  title?: string;

  constructor(title: string) {
    this.title = title;
  }
}

export class TalksQueryResult {
  @IsArray()
  @ValidateNested()
  @Type(() => Talk)
  talks: Talk[];

  constructor(talks: Talk[]) {
    this.talks = talks;
  }
}
