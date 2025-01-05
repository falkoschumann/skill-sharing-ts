// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import { assertEquals } from '@std/assert';

import { OutputTracker } from '../../src/util/output_tracker.ts';

Deno.test('Uses custom event to track output', () => {
  const eventTarget = new EventTarget();
  const outputTracker = OutputTracker.create<string>(eventTarget, 'foo');

  const event = new CustomEvent('foo', { detail: 'bar' });
  eventTarget.dispatchEvent(event);

  assertEquals(outputTracker.data, ['bar']);
});

Deno.test('Clears stored output', () => {
  const eventTarget = new EventTarget();
  const outputTracker = OutputTracker.create<string>(eventTarget, 'foo');
  const event = new CustomEvent('foo', { detail: 'bar' });
  eventTarget.dispatchEvent(event);

  const result = outputTracker.clear();

  assertEquals(result, ['bar']);
  assertEquals(outputTracker.data, []);
});

Deno.test('Stops tracking', () => {
  const eventTarget = new EventTarget();
  const outputTracker = OutputTracker.create<string>(eventTarget, 'foo');
  const event = new CustomEvent('foo', { detail: 'bar' });
  eventTarget.dispatchEvent(event);

  outputTracker.stop();
  eventTarget.dispatchEvent(event);

  assertEquals(outputTracker.data, ['bar']);
});
