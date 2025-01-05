// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import { assertEquals } from '@std/assert';

import { createStore } from '../../src/application/store.ts';
import { talksUpdated } from '../../src/application/talks_slice.ts';
import { Talk } from '../../src/domain/talks.ts';
import { UserRepository } from '../../src/infrastructure/user_repository.ts';
import { TalksApi } from '../../src/infrastructure/talks_api.ts';

Deno.test('Initializes talks with empty array', () => {
  const { store } = configure();

  const talks = store.getState().talks;

  assertEquals(talks, []);
});

Deno.test('Handles talks updated', () => {
  const { store } = configure();

  store.dispatch(talksUpdated([createTalk()]));

  const talks = store.getState().talks;
  assertEquals(talks, [createTalk()]);
});

function createTalk(
  {
    title = 'Foobar',
    presenter = 'Anon',
    summary = 'Lorem ipsum.',
    comments = [
      {
        'author': 'Bob',
        'message': 'Great!',
      },
      {
        'author': 'Anon',
        'message': 'Thanks!',
      },
    ],
  } = {},
): Talk {
  return { title, presenter, summary, comments };
}

function configure() {
  const talksApi = TalksApi.createNull();
  const userRepository = UserRepository.createNull();
  const store = createStore(talksApi, userRepository);
  return { store, talksApi };
}
