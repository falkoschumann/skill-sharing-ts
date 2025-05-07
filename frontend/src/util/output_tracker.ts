// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

export class OutputTracker<T = unknown> {
  static create<T>(eventTarget: EventTarget, event: string) {
    return new OutputTracker<T>(eventTarget, event);
  }

  readonly #eventTarget;
  readonly #event;
  readonly #tracker;
  readonly #data: T[] = [];

  constructor(eventTarget: EventTarget, event: string) {
    this.#eventTarget = eventTarget;
    this.#event = event;
    this.#tracker = (event: Event) =>
      this.#data.push((event as CustomEvent<T>).detail);

    this.#eventTarget.addEventListener(this.#event, this.#tracker);
  }

  get data() {
    return this.#data;
  }

  clear() {
    const result = [...this.#data];
    this.#data.length = 0;
    return result;
  }

  stop() {
    this.#eventTarget.removeEventListener(this.#event, this.#tracker);
  }
}
