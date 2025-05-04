// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { IsNotEmpty, IsString } from "class-validator";

export class User {
  @IsString()
  @IsNotEmpty()
  username: string;

  constructor(username: string) {
    this.username = username;
  }
}
