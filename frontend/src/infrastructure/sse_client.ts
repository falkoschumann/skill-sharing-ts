// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

export class SseClient extends EventTarget {
  static create() {
    return new SseClient(globalThis.EventSource);
  }

  static createNull() {
    return new SseClient(EventSourceStub as unknown as typeof EventSource);
  }

  #eventSourceConstructor: typeof EventSource;
  #eventSource?: EventSource;

  constructor(eventSourceConstructor: typeof EventSource) {
    super();
    this.#eventSourceConstructor = eventSourceConstructor;
  }

  get isConnected() {
    return this.#eventSource?.readyState === this.#eventSourceConstructor.OPEN;
  }

  get url() {
    return this.#eventSource?.url;
  }

  async connect(url: string | URL, eventName = "message") {
    await new Promise<void>((resolve, reject) => {
      if (this.isConnected) {
        reject(new Error("Already connected."));
        return;
      }

      try {
        this.#eventSource = new this.#eventSourceConstructor(url);
        this.#eventSource.addEventListener("open", (e) => {
          this.#handleOpen(e);
          resolve();
        });
        this.#eventSource.addEventListener(eventName, (e) =>
          this.#handleMessage(e),
        );
        this.#eventSource.addEventListener("error", (e) =>
          this.#handleError(e),
        );
      } catch (error) {
        reject(error as Error);
      }
    });
  }

  async close() {
    await new Promise<void>((resolve, reject) => {
      if (!this.isConnected) {
        resolve();
        return;
      }

      try {
        this.#eventSource?.close();
        resolve();
      } catch (error) {
        reject(error as Error);
      }
    });
  }

  simulateMessage<T>(message: T, eventName = "message", lastEventId?: string) {
    this.#handleMessage(
      new MessageEvent(eventName, { data: message, lastEventId }),
    );
  }

  simulateError() {
    this.#handleError(new Event("error"));
  }

  #handleOpen(event: Event) {
    this.dispatchEvent(new Event(event.type, event));
  }

  #handleMessage(event: MessageEvent) {
    this.dispatchEvent(
      new MessageEvent(event.type, event as unknown as MessageEventInit),
    );
  }

  #handleError(event: Event) {
    this.dispatchEvent(new Event(event.type, event));
  }
}

class EventSourceStub extends EventTarget {
  // The constants have to be defined here because JSDOM is missing EventSource.
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSED = 2;

  url: string;
  readyState = EventSourceStub.CONNECTING;

  constructor(url: string) {
    super();
    this.url = url;
    setTimeout(() => {
      this.readyState = EventSourceStub.OPEN;
      this.dispatchEvent(new Event("open"));
    }, 0);
  }

  close() {
    this.readyState = EventSourceStub.CLOSED;
  }
}
