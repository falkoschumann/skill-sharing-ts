// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import { assertEquals } from '@std/assert';

import { UserRepository } from '../../src/infrastructure/user_repository.ts';

Deno.test('Load', async (t) => {
  await t.step('Returns undefined when storage is empty', async () => {
    localStorage.clear();
    const repository = UserRepository.create();

    const user = await repository.load();

    assertEquals(user, undefined);
  });

  await t.step('Returns user', async () => {
    localStorage.setItem(
      'skillSharing.user',
      JSON.stringify({ username: 'Alice' }),
    );
    const repository = UserRepository.create();

    const user = await repository.load();

    assertEquals(user, { username: 'Alice' });
  });
});

Deno.test('Save', async () => {
  localStorage.clear();
  const repository = UserRepository.create();

  await repository.store({ username: 'Bob' });

  const user = localStorage.getItem('skillSharing.user');
  assertEquals(user, '{"username":"Bob"}');
});

Deno.test('Nulled', async (t) => {
  await t.step('Creates empty', async () => {
    const repository = UserRepository.createNull();

    const user = await repository.load();

    assertEquals(user, undefined);
  });

  await t.step('Loads user', async () => {
    const repository = UserRepository.createNull({ username: 'Charly' });

    const user = await repository.load();

    assertEquals(user, { username: 'Charly' });
  });

  await t.step('Stores user', async () => {
    const repository = UserRepository.createNull();

    await repository.store({ username: 'Dora' });

    const user = await repository.load();
    assertEquals(user, { username: 'Dora' });
  });
});
