// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { createStore } from "../../src/application/store";
import {
  changeUser,
  queryTalks,
  selectTalks,
  selectUser,
  start,
} from "../../src/application/talks_slice";
import type { User } from "../../src/domain/users";
import { TalksApi } from "../../src/infrastructure/talks_api";
import { UsersRepository } from "../../src/infrastructure/users_repository";
import { createTestTalk, createTestUser } from "../data/testdata";

describe("Store", () => {
  describe("User", () => {
    describe("Change user", () => {
      it("Updates user name", async () => {
        const { store, usersRepository } = configure();

        const user = createTestUser();
        await store.dispatch(changeUser(user));

        const settings = await usersRepository.load();
        expect(selectUser(store.getState())).toEqual(user.username);
        expect(settings).toEqual(user);
      });
    });

    it("Anon is the default user", async () => {
      const { store } = configure();

      await store.dispatch(start());

      expect(selectUser(store.getState())).toEqual("Anon");
    });

    it("Is stored user", async () => {
      const user = createTestUser();
      const { store } = configure({ user });

      await store.dispatch(start());

      expect(selectUser(store.getState())).toEqual(user.username);
    });
  });

  describe("Talks", () => {
    it("Lists all talks", async () => {
      const { store } = configure();

      await store.dispatch(queryTalks({}));

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
