// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

import { TalksRepository } from "../../src/infrastructure/talks_repository";
import { createTestTalkWithComment } from "../data/testdata";

const testFile = path.resolve(
  __dirname,
  "../../testdata/integration.repository.json",
);
const nonExistingFile = path.resolve(
  __dirname,
  "../data/talks-non-existent.json",
);
const exampleFile = path.resolve(__dirname, "../data/talks-example.json");
const corruptedFile = path.resolve(__dirname, "../data/talks-corrupt.json");

describe("Talks repository", () => {
  beforeEach(async () => {
    await fs.rm(testFile, { force: true });
  });

  describe("Find all", () => {
    it("Returns list of all talks", async () => {
      const repository = new TalksRepository({ fileName: exampleFile });

      const talks = await repository.findAll();

      expect(talks).toEqual([createTestTalkWithComment()]);
    });

    it("Returns empty list when file does not exist", async () => {
      const repository = new TalksRepository({ fileName: nonExistingFile });

      const talks = await repository.findAll();

      expect(talks).toEqual([]);
    });

    it("Reports an error when file is corrupt", async () => {
      const repository = new TalksRepository({ fileName: corruptedFile });

      const result = repository.findAll();

      await expect(result).rejects.toThrow(SyntaxError);
    });
  });

  describe("Find by title", () => {
    it("Returns talk with title", async () => {
      const repository = new TalksRepository({ fileName: exampleFile });
      const expectedTalk = createTestTalkWithComment();

      const actualTalk = await repository.findByTitle(expectedTalk.title);

      expect(actualTalk).toEqual(expectedTalk);
    });

    it("Returns undefined when talk with title does not exist", async () => {
      const repository = new TalksRepository({ fileName: exampleFile });

      const talk = await repository.findByTitle("Non existing title");

      expect(talk).toBeUndefined();
    });

    it("Returns undefined when file does not exist", async () => {
      const repository = new TalksRepository({ fileName: nonExistingFile });

      const talks = await repository.findByTitle("Any title");

      expect(talks).toBeUndefined();
    });

    it("Reports an error when file is corrupt", async () => {
      const repository = new TalksRepository({ fileName: corruptedFile });

      const result = repository.findByTitle("Any title");

      await expect(result).rejects.toThrow(SyntaxError);
    });
  });
});
