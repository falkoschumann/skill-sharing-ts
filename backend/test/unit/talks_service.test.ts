// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import * as fsPromise from "node:fs/promises";
import * as path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

import { TalksService } from "../../src/application/talks_service";
import { Failure, Success } from "../../src/domain/messages";
import { Talk } from "../../src/domain/talks";
import { TalksRepository } from "../../src/infrastructure/talks_repository";
import {
  createTestAddCommentCommand,
  createTestSubmitTalkCommand,
  createTestTalk,
  createTestTalkWithComment,
} from "../data/testdata";
import { EventEmitter2 } from "@nestjs/event-emitter";

const TEST_FILE = path.resolve(
  __dirname,
  "../../testdata/unit_talks_service.json",
);

describe("Talks service", () => {
  beforeEach(async () => {
    await fsPromise.rm(TEST_FILE, { force: true });
  });

  describe("Submit talk", () => {
    it("Adds talk to list", async () => {
      const { service, talksRepository } = await configure();

      const status = await service.submitTalk(createTestSubmitTalkCommand());

      expect(status).toEqual(new Success());
      const talks = await talksRepository.findAll();
      expect(talks).toEqual([createTestTalk()]);
    });
  });

  describe("Add comment", () => {
    it("Adds comment to talk", async () => {
      const { service, talksRepository } = await configure({
        talks: [createTestTalk()],
      });

      const status = await service.addComment(createTestAddCommentCommand());

      expect(status).toEqual(new Success());
      const talks = await talksRepository.findAll();
      expect(talks).toEqual([createTestTalkWithComment()]);
    });

    it("Reports an error when talk does not exist", async () => {
      const { service, talksRepository } = await configure({
        talks: [createTestTalk()],
      });

      const status = await service.addComment(
        createTestAddCommentCommand({
          title: "Non existing title",
        }),
      );

      expect(status).toEqual(
        new Failure(
          'The comment cannot be added because the talk "Non existing title" does not exist.',
        ),
      );
      const talks = await talksRepository.findAll();
      expect(talks).toEqual([createTestTalk()]);
    });
  });

  describe("Talks", () => {
    it("Lists all talks", async () => {
      const { service } = await configure({
        talks: [
          createTestTalk({ title: "Foo" }),
          createTestTalk({ title: "Bar" }),
        ],
      });

      const result = await service.queryTalks({});

      expect(result).toEqual({
        talks: [
          createTestTalk({ title: "Foo" }),
          createTestTalk({ title: "Bar" }),
        ],
      });
    });

    it("Finds talk by title", async () => {
      const { service } = await configure({
        talks: [
          createTestTalk({ title: "Foo" }),
          createTestTalk({ title: "Bar" }),
        ],
      });

      const result = await service.queryTalks({ title: "Foo" });

      expect(result).toEqual({
        talks: [createTestTalk({ title: "Foo" })],
      });
    });
  });
});

async function configure({ talks }: { talks?: Talk[] } = {}) {
  const talksRepository = new TalksRepository({ fileName: TEST_FILE });
  await talksRepository.saveAll(talks);
  const service = new TalksService(talksRepository, new EventEmitter2());
  return { service, talksRepository };
}
