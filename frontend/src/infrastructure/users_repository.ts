// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import type { User } from "../domain/users";

const storageKey = "skillSharing";

export class UsersRepository {
  static create() {
    return new UsersRepository(globalThis.localStorage);
  }

  static createNull({ user }: { user?: User } = {}) {
    return new UsersRepository(new StorageStub(user) as unknown as Storage);
  }

  readonly #storage: Storage;

  constructor(storage: Storage) {
    this.#storage = storage;
  }

  async load() {
    const json = this.#storage.getItem(storageKey);
    if (json == null) {
      return;
    }

    const user = JSON.parse(json) as User;
    return Promise.resolve(user);
  }

  async store(user: User) {
    const json = JSON.stringify(user);
    this.#storage.setItem(storageKey, json);
    return Promise.resolve();
  }
}

class StorageStub {
  #item: unknown;

  constructor(item: unknown) {
    this.#item = item != null ? JSON.stringify(item) : null;
  }

  getItem() {
    return this.#item;
  }

  setItem(_key: string, item: string) {
    this.#item = item;
  }
}
