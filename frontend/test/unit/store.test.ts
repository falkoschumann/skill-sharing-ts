// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { createStore } from "../../src/application/store";
import {
  addComment,
  changeUser,
  selectTalks,
  selectUser,
  start,
  submitTalk,
} from "../../src/application/talks_slice";
import type { User } from "../../src/domain/users";
import { TalksApi } from "../../src/infrastructure/talks_api";
import { UsersRepository } from "../../src/infrastructure/users_repository";
import { createTestTalk, createTestUser } from "../data/testdata";

describe("Store", () => {
  describe("Change user", () => {
    it("Updates user name", async () => {
      const { store, usersRepository } = configure();

      const user = createTestUser();
      await store.dispatch(changeUser(user));

      const settings = await usersRepository.load();
      expect(selectUser(store.getState())).toEqual(user);
      expect(settings).toEqual(user);
    });
  });

  describe("User", () => {
    it("Anon is the default user", async () => {
      const { store } = configure();

      await store.dispatch(start());

      expect(selectUser(store.getState())).toEqual({ username: "Anon" });
    });

    it("Is stored user", async () => {
      const user = createTestUser();
      const { store } = configure({ user });

      await store.dispatch(start());

      expect(selectUser(store.getState())).toEqual(user);
    });
  });

  describe("Submit talk", () => {
    it("Adds talk to list", async () => {
      const { store, talksApi } = configure();
      const talksSubmitted = talksApi.trackTalksSubmitted();

      await store.dispatch(
        submitTalk({
          title: "Foobar",
          summary: "Lorem ipsum",
        }),
      );

      expect(talksSubmitted.data).toEqual([
        { title: "Foobar", presenter: "Anon", summary: "Lorem ipsum" },
      ]);
    });
  });

  describe("Adds comment", () => {
    it("Adds comment to an existing talk", async () => {
      const { store, talksApi } = configure();
      const commentsAdded = talksApi.trackCommentsAdded();

      await store.dispatch(
        addComment({
          title: "Foobar",
          message: "Lorem ipsum",
        }),
      );

      expect(commentsAdded.data).toEqual([
        {
          title: "Foobar",
          comment: { author: "Anon", message: "Lorem ipsum" },
        },
      ]);
    });
  });

  describe("Talks", () => {
    it("Lists all talks", async () => {
      const { store } = configure();

      await store.dispatch(start());

      expect(selectTalks(store.getState())).toEqual([createTestTalk()]);
    });
  });
});

function configure({ user }: { user?: User } = {}) {
  const talksApi = TalksApi.createNull();
  const usersRepository = UsersRepository.createNull({ user });
  const store = createStore(talksApi, usersRepository);
  return { store, talksApi, usersRepository };
}
