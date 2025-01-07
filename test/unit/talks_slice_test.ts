// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import { assertEquals } from '@std/assert';

import { createStore } from '../../src/application/store.ts';
import {
  addComment,
  connect,
  deleteTalk,
  submitTalk,
  talksUpdated,
} from '../../src/application/talks_slice.ts';
import { Talk } from '../../src/domain/talks.ts';
import { UserRepository } from '../../src/infrastructure/user_repository.ts';
import { TalksApi } from '../../src/infrastructure/talks_api.ts';
import { User } from '../../src/domain/user.ts';
import { loadUser } from '../../src/application/user_slice.ts';

Deno.test('Initializes talks with empty array', () => {
  const { store } = configure();

  const talks = store.getState().talks;

  assertEquals(talks, []);
});

Deno.test('Receives talks', async () => {
  const { store, talksApi } = configure();
  const storeUpdated = new Promise<void>((resolve) =>
    store.subscribe(() => resolve())
  );
  await store.dispatch(connect());

  talksApi.simulateMessage([createTalk()]);
  await storeUpdated;

  assertEquals(store.getState().talks, [createTalk()]);
});

Deno.test('Submits talk', async () => {
  const { store, talksApi } = configure();
  const talksSubmitted = talksApi.trackTalksSubmitted();
  await store.dispatch(loadUser());

  await store.dispatch(submitTalk({
    title: 'title-1',
    summary: 'summary-1',
  }));

  assertEquals(talksSubmitted.data, [{
    title: 'title-1',
    presenter: 'Anon',
    summary: 'summary-1',
  }]);
});

Deno.test('Adds comment', async () => {
  const { store, talksApi } = configure({ user: { username: 'author-1' } });
  const commentsAdded = talksApi.trackCommentsAdded();
  await store.dispatch(loadUser());

  await store.dispatch(
    addComment({ title: 'title-1', message: 'message-1' }),
  );

  assertEquals(commentsAdded.data, [{
    title: 'title-1',
    comment: { author: 'author-1', message: 'message-1' },
  }]);
});

Deno.test('Deletes talk', async () => {
  const { store, talksApi } = configure();
  const talksDeleted = talksApi.trackTalksDeleted();

  await store.dispatch(deleteTalk({ title: 'title-1' }));

  assertEquals(talksDeleted.data, [{ title: 'title-1' }]);
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

function configure({ user }: { user?: User } = {}) {
  const talksApi = TalksApi.createNull();
  const userRepository = UserRepository.createNull(user);
  const store = createStore(talksApi, userRepository);
  return { store, talksApi };
}
