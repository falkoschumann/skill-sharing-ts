// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import { assertEquals } from '@std/assert';

import { CommandStatus } from '../../src/application/messages.ts';
import { Talk } from '../../src/domain/talks.ts';
import {
  TalksApi,
  TalksUpdatedEvent,
} from '../../src/infrastructure/talks_api.ts';
import { SseClient } from '../../src/infrastructure/sse_client.ts';

Deno.test('Nulled', async (t) => {
  await t.step('Submits talk', async () => {
    const api = TalksApi.createNull();
    const talksPut = api.trackTalksSubmitted();

    const status = await api.submitTalk({
      title: 'title-1',
      presenter: 'presenter-1',
      summary: 'summary-1',
    });

    assertEquals(status, CommandStatus.success());
    assertEquals(talksPut.data, [{
      title: 'title-1',
      presenter: 'presenter-1',
      summary: 'summary-1',
    }]);
  });

  await t.step('Add comment', async () => {
    const api = TalksApi.createNull();
    const commentsPosted = api.trackCommentsAdded();

    await api.addComment(
      {
        title: 'title-1',
        comment: { author: 'author-1', message: 'message-1' },
      },
    );

    assertEquals(commentsPosted.data, [
      {
        title: 'title-1',
        comment: { author: 'author-1', message: 'message-1' },
      },
    ]);
  });

  await t.step('Deletes talk', async () => {
    const api = TalksApi.createNull();
    const talksDeleted = api.trackTalksDeleted();

    await api.deleteTalk({ title: 'title-1' });

    assertEquals(talksDeleted.data, [{ title: 'title-1' }]);
  });

  await t.step('Queries talks', async () => {
    const talksClient = SseClient.createNull();
    const api = new TalksApi(
      talksClient,
      () => Promise.resolve<Response>(new Response()),
    );
    const eventPromise = new Promise<TalksUpdatedEvent>((resolve) => {
      api.addEventListener(
        TalksUpdatedEvent.TYPE,
        (event) => resolve(event as TalksUpdatedEvent),
      );
    });

    await api.connect();
    talksClient.simulateMessage(JSON.stringify([createTalk()]));
    const event = await eventPromise;

    assertEquals(event.type, TalksUpdatedEvent.TYPE);
    assertEquals(event.talks, [createTalk()]);
    await api.close();
  });
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
