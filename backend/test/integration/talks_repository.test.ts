// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

import { TalksRepository } from "../../src/infrastructure/talks_repository";
import { createTestTalk, createTestTalkWithComment } from "../data/testdata";

const TEST_FILE = path.resolve(
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
    await fs.rm(TEST_FILE, { force: true });
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

  describe("Save", () => {
    it("Creates file when file does not exist", async () => {
      const repository = new TalksRepository({ fileName: TEST_FILE });

      const talk = createTestTalk();
      await repository.save(talk);

      const talks = await repository.findAll();
      expect(talks).toEqual([talk]);
    });

    it("Adds talk when file exists", async () => {
      const repository = new TalksRepository({ fileName: TEST_FILE });
      const talk1 = createTestTalk({ title: "Foo" });
      await repository.save(talk1);

      const talk2 = createTestTalk({ title: "Bar" });
      await repository.save(talk2);

      const talks = await repository.findAll();
      expect(talks).toEqual([talk1, talk2]);
    });

    it("Updates talk when talk exists", async () => {
      const repository = new TalksRepository({ fileName: TEST_FILE });
      const talk = createTestTalk({
        presenter: "Alice",
      });
      await repository.save(talk);

      const updatedTalk = createTestTalk({ presenter: "Bob" });
      await repository.save(updatedTalk);

      const talks = await repository.findAll();
      expect(talks).toEqual([updatedTalk]);
    });

    it("Reports an error when file is corrupt", async () => {
      const repository = new TalksRepository({ fileName: corruptedFile });

      const talk = createTestTalk();
      const result = repository.save(talk);

      await expect(result).rejects.toThrow(SyntaxError);
    });
  });

  describe("Delete", () => {
    it("Deletes talk", async () => {
      const repository = new TalksRepository({ fileName: TEST_FILE });
      const talk = createTestTalk();
      await repository.save(talk);

      await repository.deleteByTitle(talk.title);

      const talks = await repository.findAll();
      expect(talks).toEqual([]);
    });

    it("Does not reports an error when file does not exist", async () => {
      const repository = new TalksRepository({ fileName: TEST_FILE });

      const talks = await repository.deleteByTitle("Any title");

      expect(talks).toBeUndefined();
    });

    it("Reports an error when file is corrupt", async () => {
      const repository = new TalksRepository({ fileName: corruptedFile });

      const result = repository.deleteByTitle("Any title");

      await expect(result).rejects.toThrow(SyntaxError);
    });
  });
});
