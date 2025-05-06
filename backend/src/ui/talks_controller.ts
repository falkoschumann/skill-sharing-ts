// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { Body, Controller, Get, Header, Post, Query } from "@nestjs/common";

import { TalksService } from "../application/talks_service";
import {
  CommandStatus,
  SubmitTalkCommand,
  TalksQueryResult,
} from "../domain/messages";

@Controller("api/talks")
export class TalksController {
  #service;

  constructor(service: TalksService) {
    this.#service = service;
  }

  @Post("submit-talk")
  @Header("Content-Type", "application/json")
  async submitTalk(@Body() command: SubmitTalkCommand): Promise<CommandStatus> {
    return this.#service.submitTalk(command);
  }

  @Get("query-talks")
  @Header("Content-Type", "application/json")
  async queryTalks(@Query("title") title: string): Promise<TalksQueryResult> {
    return this.#service.queryTalks({ title });
  }
}
