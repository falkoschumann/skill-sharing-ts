// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import {
  Body,
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from "@nestjs/common";

import { TalksService } from "../application/talks_service";
import {
  AddCommentCommand,
  CommandStatus,
  Failure,
  SubmitTalkCommand,
  TalksQueryResult,
} from "../domain/messages";

@Controller("api/talks")
export class TalksController {
  readonly #service;

  constructor(service: TalksService) {
    this.#service = service;
  }

  @Post("submit-talk")
  @Header("Content-Type", "application/json")
  async submitTalk(@Body() command: SubmitTalkCommand): Promise<CommandStatus> {
    return this.#service.submitTalk(command);
  }

  @Post("add-comment")
  @Header("Content-Type", "application/json")
  async addComment(@Body() command: AddCommentCommand): Promise<CommandStatus> {
    const status = await this.#service.addComment(command);
    if (status instanceof Failure) {
      throw new HttpException(status, HttpStatus.BAD_REQUEST);
    }
    return status;
  }

  @Get("query-talks")
  @Header("Content-Type", "application/json")
  async queryTalks(@Query("title") title: string): Promise<TalksQueryResult> {
    return this.#service.queryTalks({ title });
  }
}
