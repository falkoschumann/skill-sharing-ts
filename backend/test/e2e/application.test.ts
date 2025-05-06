// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import path from "node:path";
import fs from "node:fs/promises";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { App } from "supertest/types";
import { beforeEach, describe, expect, it } from "vitest";

import { AppModule } from "../../src/app_module";
import {
  createTestSubmitTalkCommand,
  createTestTalk,
  createTestTalksQueryResult,
} from "../data/testdata";
import { Success } from "../../src/domain/messages";

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
      const status = await request(app.getHttpServer())
        .post("/api/talks/submit-talk")
        .set("Content-Type", "application/json")
        .send(createTestSubmitTalkCommand());

      expect(status.headers["content-type"]).toMatch(/json/);
      expect(status.status).toEqual(201);
      expect(status.body).toEqual(new Success());

      const result = await request(app.getHttpServer()).get(
        "/api/talks/query-talks",
      );

      expect(result.status).toEqual(200);
      expect(result.body).toEqual(createTestTalksQueryResult());
    });

    it("Reports an error when talk could not add", async () => {
      const status = await request(app.getHttpServer())
        .post("/api/talks/submit-talk")
        .set("Content-Type", "application/json")
        // @ts-expect-error TS2322
        .send(createTestSubmitTalkCommand({ presenter: null }));

      expect(status.headers["content-type"]).toMatch(/json/);
      expect(status.status).toEqual(400);

      const result = await request(app.getHttpServer()).get(
        "/api/talks/query-talks",
      );

      expect(result.status).toEqual(200);
      expect(result.body).toEqual(createTestTalksQueryResult({ talks: [] }));
    });
  });

  describe("Talks", () => {
    it("Returns all talks", async () => {
      await request(app.getHttpServer())
        .post("/api/talks/submit-talk")
        .set("Content-Type", "application/json")
        .send(createTestSubmitTalkCommand({ title: "Foo" }));
      await request(app.getHttpServer())
        .post("/api/talks/submit-talk")
        .set("Content-Type", "application/json")
        .send(createTestSubmitTalkCommand({ title: "Bar" }));
      // TODO Add comment to talk Bar

      const result = await request(app.getHttpServer()).get(
        "/api/talks/query-talks",
      );

      expect(result.status).toEqual(200);
      expect(result.body).toEqual({
        talks: [
          createTestTalk({ title: "Foo" }),
          //createTestTalkWithComment({ title: "Bar" }),
          createTestTalk({ title: "Bar" }),
        ],
      });
    });

    it("Returns a single talk when client asks for a specific talk", async () => {
      await request(app.getHttpServer())
        .post("/api/talks/submit-talk")
        .set("Content-Type", "application/json")
        .send(createTestSubmitTalkCommand({ title: "Foo" }));

      const result = await request(app.getHttpServer()).get(
        "/api/talks/query-talks?title=Foo",
      );

      expect(result.status).toEqual(200);
      expect(result.body).toEqual({
        talks: [createTestTalk({ title: "Foo" })],
      });
    });

    it("Returns no talk when client asks for a specific talk that does not exist", () => {
      return request(app.getHttpServer())
        .get(
          "/api/talks/query-talks?title=" +
            encodeURIComponent("Non existing talk"),
        )
        .expect(200)
        .expect(JSON.stringify({ talks: [] }));
    });
  });
});
