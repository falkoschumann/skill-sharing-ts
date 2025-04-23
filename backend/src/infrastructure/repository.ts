// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import * as fsPromise from 'node:fs/promises';
import { Injectable } from '@nestjs/common';

import { Talk } from '../domain/talks';
import { validate } from '../util/validation';

type FsPromise = Pick<
  typeof import('node:fs/promises'),
  'readFile' | 'writeFile' | 'mkdir'
>;

export class RepositoryConfiguration {
  static create({
    fileName = process.env.REPOSITORY_FILE_NAME || './data/talks.json',
  } = {}) {
    return new RepositoryConfiguration(fileName);
  }

  static createTestInstance({ fileName = 'null-repository.json' } = {}) {
    return new RepositoryConfiguration(fileName);
  }

  constructor(public fileName: string) {}
}

@Injectable()
export class Repository {
  static create(configuration = RepositoryConfiguration.create()) {
    return new Repository(configuration, fsPromise);
  }

  static createNull({ talks }: { talks?: Talk[] } = {}) {
    return new Repository(
      RepositoryConfiguration.createTestInstance(),
      new FsStub(talks),
    );
  }

  #configuration: RepositoryConfiguration;
  #fs: FsPromise;

  constructor(
    configuration = RepositoryConfiguration.create(),
    fs: FsPromise = fsPromise,
  ) {
    this.#configuration = configuration;
    this.#fs = fs;
  }

  async findAll() {
    const dto = await this.#load();
    const talks = fromDto(dto);
    return validate(Talk, talks);
  }

  async #load() {
    try {
      const { fileName } = this.#configuration;
      const json = await this.#fs.readFile(fileName, 'utf-8');
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

function toDto(talks: Talk[]): TalksDto {
  const dto = {};
  for (const talk of talks) {
    dto[talk.title] = talk;
  }
  return dto;
}

class FsStub {
  #fileContent;

  constructor(talks?: Talk[]) {
    if (talks != null) {
      this.#fileContent = JSON.stringify(toDto(talks));
    }
  }

  readFile() {
    if (this.#fileContent == null) {
      throw new CustomError('No such file or directory', 'ENOENT');
    }

    return Promise.resolve(this.#fileContent);
  }

  writeFile(_file: unknown, data: string) {
    this.#fileContent = data;
    return Promise.resolve();
  }

  mkdir() {
    return Promise.resolve(undefined);
  }
}

class CustomError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
  }
}
