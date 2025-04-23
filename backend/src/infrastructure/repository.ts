// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import * as fsPromise from 'node:fs/promises';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

import { Talk } from '../domain/talks';
import { validate } from '../util/validation';

export interface RepositoryConfiguration {
  fileName: string;
}

export const repositoryConfigurationFactory = registerAs('repository', () => ({
  fileName: process.env.REPOSITORY_FILE_NAME || './data/talks.json',
}));

@Injectable()
export class Repository {
  #configuration: RepositoryConfiguration;

  constructor(
    @Inject(repositoryConfigurationFactory.KEY)
    configuration: ConfigType<typeof repositoryConfigurationFactory>,
  ) {
    this.#configuration = configuration;
  }

  async findAll() {
    const dto = await this.#load();
    const talks = fromDto(dto);
    return validate(Talk, talks);
  }

  async #load() {
    try {
      const { fileName } = this.#configuration;
      const json = await fsPromise.readFile(fileName, 'utf-8');
      return JSON.parse(json) as TalksDto;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // No such file or directory
        return {};
      }

      throw error;
    }
  }
}

type TalksDto = Record<string, Talk>;

function fromDto(dto: TalksDto) {
  return Object.values(dto);
}
