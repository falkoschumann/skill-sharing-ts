import { User } from '../domain/user.ts';

const storageKey = 'skillSharing.user';

export class UserRepository {
  static create(): UserRepository {
    return new UserRepository(globalThis.localStorage);
  }

  static createNull(user?: User): UserRepository {
    return new UserRepository(new NullStorage(user) as unknown as Storage);
  }

  readonly #storage;

  constructor(storage: Storage) {
    this.#storage = storage;
  }

  load(): Promise<User | undefined> {
    const json = this.#storage.getItem(storageKey);
    if (json == null) {
      return Promise.resolve(undefined);
    }

    const user = JSON.parse(json);
    return Promise.resolve(user);
  }

  store(user: User) {
    const json = JSON.stringify(user);
    this.#storage.setItem(storageKey, json);
    return Promise.resolve();
  }
}

class NullStorage {
  #user;

  constructor(user?: User) {
    this.#user = user;
  }

  getItem(_key: string): string | null {
    return JSON.stringify(this.#user);
  }

  setItem(_key: string, value: string) {
    this.#user = JSON.parse(value);
  }
}
