// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { Injectable } from "@nestjs/common";

import { TalksQuery, TalksQueryResult } from "../domain/messages";
import { TalksRepository } from "../infrastructure/talks_repository";

@Injectable()
export class TalksService {
  #repository: TalksRepository;

  constructor(repository: TalksRepository) {
    this.#repository = repository;
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
