// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { Injectable, Logger } from "@nestjs/common";

import {
  SubmitTalkCommand,
  Success,
  TalksQuery,
  TalksQueryResult,
} from "../domain/messages";
import { TalksRepository } from "../infrastructure/talks_repository";
import { EventEmitter2 } from "@nestjs/event-emitter";

export class TalksChanged {
  static type = "talks-changed";
}

@Injectable()
export class TalksService {
  readonly #logger = new Logger(TalksService.name);
  #repository;
  #eventEmitter;

  constructor(repository: TalksRepository, eventEmitter: EventEmitter2) {
    this.#repository = repository;
    this.#eventEmitter = eventEmitter;
  }

  async submitTalk(command: SubmitTalkCommand) {
    this.#logger.log("Submit talk", command);

    await this.#repository.save({ ...command, comments: [] });
    this.#eventEmitter.emit(TalksChanged.type, new TalksChanged());
    return new Success();
  }

  async queryTalks(query: TalksQuery): Promise<TalksQueryResult> {
    if (query?.title != null) {
      const talk = await this.#repository.findByTitle(query.title);
      const talks = talk ? [talk] : [];
      return { talks };
    }

    const talks = await this.#repository.findAll();
    return { talks };
  }
}
