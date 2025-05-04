// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { User } from "../domain/users";

const storageKey = "skillSharing";

export class UsersRepository {
  static create() {
    return new UsersRepository(globalThis.localStorage);
  }

  static createNull({ user }: { user?: User } = {}) {
    return new UsersRepository(new StorageStub(user) as unknown as Storage);
  }

  #storage;

  constructor(storage: Storage) {
    this.#storage = storage;
  }

  async load(): Promise<User | undefined> {
    const json = this.#storage.getItem(storageKey);
    if (json == null) {
      return;
    }

    // TODO Validate user
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
  #item;

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
