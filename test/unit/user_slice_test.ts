// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import { assertEquals } from '@std/assert';

import { createStore } from '../../src/application/store.ts';
import {
  changeUser,
  loadUser,
  userChanged,
} from '../../src/application/user_slice.ts';
import { User } from '../../src/domain/user.ts';
import { TalksApi } from '../../src/infrastructure/talks_api.ts';
import { UserRepository } from '../../src/infrastructure/user_repository.ts';

Deno.test('Initializes with user Anon', () => {
  const { store } = configure();

  const user = store.getState().user;

  assertEquals(user, { username: 'Anon' });
});

Deno.test('Loads user', async () => {
  const { store } = configure({ user: { username: 'Charly' } });

  await store.dispatch(loadUser());

  const user = store.getState().user;
  assertEquals(user, { username: 'Charly' });
});

Deno.test('Changes user', async () => {
  const { store } = configure();

  await store.dispatch(changeUser({ username: 'Dora' }));

  const user = store.getState().user;
  assertEquals(user, { username: 'Dora' });
});

Deno.test('Handles user changed', () => {
  const { store } = configure();

  store.dispatch(userChanged({ username: 'Bob' }));

  const user = store.getState().user;
  assertEquals(user, { username: 'Bob' });
});

function configure({ user }: { user?: User } = {}) {
  const talksApi = TalksApi.createNull();
  const userRepository = UserRepository.createNull(user);
  const store = createStore(talksApi, userRepository);
  return { store, userRepository };
}
