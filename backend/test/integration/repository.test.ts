// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import { Repository } from '../../src/infrastructure/repository';
import { createTestTalkWithComment } from '../data/testdata';

const testFile = path.join(
  __dirname,
  '../../testdata/integration.repository.json',
);
const nonExistingFile = path.join(__dirname, '../data/talks-non-existent.json');
const exampleFile = path.join(__dirname, '../data/talks-example.json');
const corruptedFile = path.join(__dirname, '../data/talks-corrupt.json');

describe('Repository', () => {
  beforeEach(async () => {
    await fs.rm(testFile, { force: true });
  });

  describe('Find all', () => {
    it('Returns list of all talks', async () => {
      const repository = Repository.create({ fileName: exampleFile });

      const talks = await repository.findAll();

      expect(talks).toEqual([createTestTalkWithComment()]);
    });

    it('Returns empty list when file does not exist', async () => {
      const repository = Repository.create({ fileName: nonExistingFile });

      const talks = await repository.findAll();

      expect(talks).toEqual([]);
    });

    it('Reports an error when file is corrupt', async () => {
      const repository = Repository.create({ fileName: corruptedFile });

      const result = repository.findAll();

      await expect(result).rejects.toThrow(SyntaxError);
    });
  });
});
