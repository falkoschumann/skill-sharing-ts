// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import { assert, assertEquals, assertFalse, assertRejects } from '@std/assert';

import { SseClient } from '../../src/infrastructure/sse_client.ts';

Deno.test('Creates a client without connection', () => {
  const client = SseClient.createNull();

  assertFalse(client.isConnected);
});

Deno.test('Connects to the server', async () => {
  const client = SseClient.createNull();

  await client.connect('https://example.com');

  assert(client.isConnected);
  assertEquals(client.url, 'https://example.com');
});

Deno.test('Emits event when connected', async () => {
  const client = SseClient.createNull();
  const eventPromise = new Promise<Event>((resolve) => {
    client.addEventListener('open', (event) => resolve(event));
  });

  await client.connect('https://example.com');
  const event = await eventPromise;

  assertEquals(event.type, 'open');
});

Deno.test('Rejects multiple connections', async () => {
  const client = SseClient.createNull();
  await client.connect('https://example.com');

  await assertRejects(
    () => client.connect('https://example.com'),
    Error,
    'Already connected.',
  );
});

Deno.test('Closes the connection', async () => {
  const client = SseClient.createNull();
  await client.connect('https://example.com');

  await client.close();

  assertFalse(client.isConnected);
});

Deno.test('Does nothing when closing a disconnected client', async () => {
  const client = SseClient.createNull();
  await client.connect('https://example.com');
  await client.close();

  await client.close();

  assertFalse(client.isConnected);
});

Deno.test('Receives a message', async () => {
  const client = SseClient.createNull();
  const eventPromise = new Promise<MessageEvent>((resolve) => {
    client.addEventListener(
      'message',
      (event) => resolve(event as MessageEvent),
    );
  });
  await client.connect('https://example.com');

  client.simulateMessage('lorem ipsum', undefined, '1');
  const event = await eventPromise;

  assertEquals(event.type, 'message');
  assertEquals(event.data, 'lorem ipsum');
  assertEquals(event.lastEventId, '1');
});

Deno.test('Receives a typed message', async () => {
  const client = SseClient.createNull();
  const eventPromise = new Promise<MessageEvent>((resolve) => {
    client.addEventListener('ping', (event) => resolve(event as MessageEvent));
  });
  await client.connect('https://example.com');

  client.simulateMessage('lorem ipsum', 'ping');
  const event = await eventPromise;

  assertEquals(event.type, 'ping');
  assertEquals(event.data, 'lorem ipsum');
});

Deno.test('Handles an error', async () => {
  const client = SseClient.createNull();
  const eventPromise = new Promise<Event>((resolve) => {
    client.addEventListener('error', (event) => resolve(event));
  });
  await client.connect('https://example.com');

  client.simulateError();
  const event = await eventPromise;

  assertEquals(event.type, 'error');
});
