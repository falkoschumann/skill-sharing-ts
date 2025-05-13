// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import path from "node:path";
import fs from "node:fs/promises";
import type { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import type { App } from "supertest/types";
import { beforeEach, describe, expect, it } from "vitest";

import {
  AddCommentCommand,
  DeleteTalkCommand,
  Failure,
  SubmitTalkCommand,
  Success,
  TalksQuery,
} from "../../src/domain/messages";
import { AppModule } from "../../src/app_module";
import {
  createTestAddCommentCommand,
  createTestComment,
  createTestDeleteTalkCommand,
  createTestSubmitTalkCommand,
  createTestTalk,
  createTestTalksQueryResult,
  createTestTalksQueryResultWithComment,
  createTestTalkWithComment,
} from "../data/testdata";

describe("Application", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    process.env.REPOSITORY_FILE_NAME = path.resolve(
      __dirname,
      "../../testdata/e2e_application.json",
    );
    await fs.rm(process.env.REPOSITORY_FILE_NAME, { force: true });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  describe("Submit talk", () => {
    it("Adds talk to list", async () => {
      const status = await submitTalk(app, createTestSubmitTalkCommand());

      expect(status.headers["content-type"]).toMatch(/json/);
      expect(status.status).toEqual(201);
      expect(status.body).toEqual(new Success());

      const result = await queryTalks(app, {});

      expect(result.status).toEqual(200);
      expect(result.body).toEqual(createTestTalksQueryResult());
    });

    it("Reports an error when talk could not add", async () => {
      const status = await submitTalk(
        app,
        // @ts-expect-error TS2322
        createTestSubmitTalkCommand({ presenter: null }),
      );

      expect(status.headers["content-type"]).toMatch(/json/);
      expect(status.status).toEqual(400);

      const result = await queryTalks(app, {});

      expect(result.status).toEqual(200);
      expect(result.body).toEqual(createTestTalksQueryResult({ talks: [] }));
    });
  });

  describe("Add comment", () => {
    it("Adds comment to an existing talk", async () => {
      await submitTalk(app, createTestSubmitTalkCommand());

      const status = await addComment(app, createTestAddCommentCommand());

      expect(status.status).toEqual(201);
      expect(status.body).toEqual(new Success());
      const result = await queryTalks(app, {});
      expect(result.status).toEqual(200);
      expect(result.body).toEqual(createTestTalksQueryResultWithComment());
    });

    it("Reports an error when talk does not exists", async () => {
      await submitTalk(app, createTestSubmitTalkCommand());

      const status = await addComment(
        app,
        createTestAddCommentCommand({ title: "Non existing talk" }),
      );

      expect(status.status).toEqual(400);
      expect(status.body).toEqual(
        new Failure(
          'The comment cannot be added because the talk "Non existing talk" does not exist.',
        ),
      );
    });

    it("Reports an error when comment could not add", async () => {
      await submitTalk(app, createTestSubmitTalkCommand());

      const status = await addComment(
        app,
        createTestAddCommentCommand({
          // @ts-expect-error TS2322
          comment: createTestComment({ author: null }),
        }),
      );

      expect(status.status).toEqual(400);
    });
  });

  describe("Delete talk", () => {
    it("Deletes an existing talk", async () => {
      await submitTalk(app, createTestSubmitTalkCommand());

      const status = await deleteTalk(app, createTestDeleteTalkCommand());

      expect(status.status).toEqual(200);
      expect(status.body).toEqual(new Success());
    });

    it("Reports no error when talk does not exist", async () => {
      const status = await deleteTalk(
        app,
        createTestDeleteTalkCommand({ title: "non-existing-talk" }),
      );

      expect(status.status).toEqual(200);
      expect(status.body).toEqual(new Success());
    });
  });

  describe("Talks", () => {
    it("Returns all talks", async () => {
      await submitTalk(app, createTestSubmitTalkCommand({ title: "Foo" }));
      await addComment(app, createTestAddCommentCommand({ title: "Foo" }));
      await submitTalk(app, createTestSubmitTalkCommand({ title: "Bar" }));

      const result = await queryTalks(app, {});

      expect(result.status).toEqual(200);
      expect(result.body).toEqual({
        talks: [
          createTestTalkWithComment({ title: "Foo" }),
          createTestTalk({ title: "Bar" }),
        ],
      });
    });

    it("Returns a single talk when client asks for a specific talk", async () => {
      await submitTalk(app, createTestSubmitTalkCommand({ title: "Foo" }));

      const result = await queryTalks(app, { title: "Foo" });

      expect(result.status).toEqual(200);
      expect(result.body).toEqual({
        talks: [createTestTalk({ title: "Foo" })],
      });
    });

    it("Returns no talk when client asks for a specific talk that does not exist", async () => {
      const result = await queryTalks(app, { title: "Non existing talk" });

      expect(result.status).toEqual(200);
      expect(result.body).toEqual({ talks: [] });
    });
  });
});

async function submitTalk(
  app: INestApplication<App>,
  command: SubmitTalkCommand,
) {
  return request(app.getHttpServer())
    .post("/api/talks/submit-talk")
    .set("Content-Type", "application/json")
    .send(command);
}

async function addComment(
  app: INestApplication<App>,
  command: AddCommentCommand,
) {
  return request(app.getHttpServer())
    .post(`/api/talks/add-comment`)
    .set("Content-Type", "application/json")
    .send(command);
}

async function deleteTalk(
  app: INestApplication<App>,
  command: DeleteTalkCommand,
) {
  return request(app.getHttpServer())
    .post("/api/talks/delete-talk")
    .set("Content-Type", "application/json")
    .send(command);
}

async function queryTalks(app: INestApplication<App>, query: TalksQuery) {
  let url = "/api/talks/query-talks";
  if (query.title != null) {
    url += `?title=${encodeURIComponent(query.title)}`;
  }
  return request(app.getHttpServer()).get(url);
}
