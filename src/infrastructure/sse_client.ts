// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import { MessageClient } from './message_client.ts';

/**
 * A client for the server-sent events protocol.
 */
export class SseClient extends EventTarget implements MessageClient {
  /**
   * Creates a new SSE client.
   */
  static create(): SseClient {
    return new SseClient(EventSource);
  }

  /**
   * Creates a new nulled SSE client.
   */
  static createNull(): SseClient {
    return new SseClient(EventSourceStub as typeof EventSource);
  }

  readonly #eventSourceConstructor;
  #eventSource?: EventSource;

  /**
   * The constructor is for internal use. Use the factory methods instead.
   *
   * @see SseClient.create
   * @see SseClient.createNull
   */
  constructor(eventSourceConstructor: typeof EventSource) {
    super();
    this.#eventSourceConstructor = eventSourceConstructor;
  }

  /**
   * Returns whether the client is connected.
   */
  get isConnected(): boolean {
    return this.#eventSource?.readyState === this.#eventSourceConstructor.OPEN;
  }

  /**
   * Returns the server URL.
   */
  get url(): string {
    return this.#eventSource!.url;
  }

  /**
   * Connects to the server.
   *
   * @param url The server URL to connect to.
   * @param eventName The optional event type to listen to.
   */
  async connect(url: URL | string, eventName = 'message') {
    await new Promise<void>((resolve, reject) => {
      if (this.isConnected) {
        reject(new Error('Already connected.'));
        return;
      }

      try {
        this.#eventSource = new this.#eventSourceConstructor(url);
        this.#eventSource.addEventListener('open', (e) => {
          this.#handleOpen(e);
          resolve();
        });
        this.#eventSource.addEventListener(
          eventName,
          (e) => this.#handleMessage(e),
        );
        this.#eventSource.addEventListener(
          'error',
          (e) => this.#handleError(e),
        );
      } catch (error) {
        reject(error);
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
        reject(error);
      }
    });
  }

  /**
   * Simulates a message event from the server.
   *
   * @param message The message to receive.
   * @param eventName The optional event type.
   * @param lastEventId The optional last event ID.
   */
  simulateMessage(
    message: string,
    eventName = 'message',
    lastEventId?: string,
  ) {
    this.#handleMessage(
      new MessageEvent(eventName, { data: message, lastEventId }),
    );
  }

  /**
   * Simulates an error event.
   */
  simulateError() {
    this.#handleError(new Event('error'));
  }

  #handleOpen(event: Event) {
    this.dispatchEvent(new Event(event.type, event));
  }

  #handleMessage(event: Event) {
    this.dispatchEvent(new MessageEvent(event.type, event));
  }

  #handleError(event: Event) {
    this.dispatchEvent(new Event(event.type, event));
  }
}

class EventSourceStub extends EventTarget {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSED = 2;

  readyState: number = EventSourceStub.CONNECTING;

  constructor(public readonly url: URL | string) {
    super();
    setTimeout(() => {
      this.readyState = EventSourceStub.OPEN;
      this.dispatchEvent(new Event('open'));
    }, 0);
  }

  close() {
    this.readyState = EventSourceStub.CLOSED;
  }
}
