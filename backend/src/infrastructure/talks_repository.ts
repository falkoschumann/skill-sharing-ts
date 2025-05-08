// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import * as fsPromise from "node:fs/promises";
import * as path from "node:path";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType, registerAs } from "@nestjs/config";

import { Talk } from "../domain/talks";

export interface RepositoryConfiguration {
  fileName: string;
}

export const repositoryConfigurationFactory = registerAs("repository", () => ({
  fileName: process.env.REPOSITORY_FILE_NAME || "./data/talks.json",
}));

@Injectable()
export class TalksRepository {
  readonly #configuration: RepositoryConfiguration;

  constructor(
    @Inject(repositoryConfigurationFactory.KEY)
    configuration: ConfigType<typeof repositoryConfigurationFactory>,
  ) {
    this.#configuration = configuration;
  }

  async findAll() {
    const dto = await this.#load();
    return fromDto(dto);
  }

  async findByTitle(title: string) {
    const talks = await this.#load();
    const talk = talks[title];
    if (talk != null) {
      return talk;
    }
  }

  async save(talk: Talk) {
    const dto = await this.#load();
    dto[talk.title] = talk;
    await this.#store(dto);
  }

  async saveAll(talks: Talk[] = []) {
    const dto = await this.#load();
    talks.forEach((talk) => (dto[talk.title] = talk));
    await this.#store(dto);
  }

  async deleteByTitle(title: string): Promise<void> {
    const talks = await this.#load();
    delete talks[title];
    await this.#store(talks);
  }

  async #load() {
    try {
      const { fileName } = this.#configuration;
      const json = await fsPromise.readFile(fileName, "utf-8");
      return JSON.parse(json) as TalksDto;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        // No such file or directory
        return {};
      }

      throw error;
    }
  }

  async #store(talks: TalksDto) {
    const { fileName } = this.#configuration;
    const dirName = path.dirname(fileName);
    await fsPromise.mkdir(dirName, { recursive: true });

    const json = JSON.stringify(talks);
    await fsPromise.writeFile(fileName, json, "utf-8");
  }
}

type TalksDto = Record<string, Talk>;

function fromDto(dto: TalksDto) {
  return Object.values(dto);
}
