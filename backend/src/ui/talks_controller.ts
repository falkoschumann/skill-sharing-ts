// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import type { MessageEvent } from "@nestjs/common";
import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Sse,
} from "@nestjs/common";

import { TalksChanged, TalksService } from "../application/talks_service";
import type { CommandStatus } from "../domain/messages";
import {
  AddCommentCommand,
  DeleteTalkCommand,
  Failure,
  SubmitTalkCommand,
  TalksQueryResult,
} from "../domain/messages";
import { Observable, Subject } from "rxjs";
import { OnEvent } from "@nestjs/event-emitter";

@Controller("api/talks")
export class TalksController {
  readonly #talksUpdated = new Subject<MessageEvent>();
  readonly #service: TalksService;

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

  @Post("delete-talk")
  @HttpCode(200)
  @Header("Content-Type", "application/json")
  async deleteTalk(@Body() command: DeleteTalkCommand): Promise<CommandStatus> {
    return this.#service.deleteTalk(command);
  }

  @Get("query-talks")
  @Header("Content-Type", "application/json")
  async queryTalks(@Query("title") title: string): Promise<TalksQueryResult> {
    return this.#service.queryTalks({ title });
  }

  @Sse("events")
  talksChanged(): Observable<MessageEvent> {
    setTimeout(() => void this.handleTalksChanged(new TalksChanged()));
    return this.#talksUpdated.asObservable();
  }

  @OnEvent(TalksChanged.type)
  async handleTalksChanged(_payload: TalksChanged) {
    const talks = await this.#service.queryTalks({});
    this.#talksUpdated.next({ data: talks });
  }
}
