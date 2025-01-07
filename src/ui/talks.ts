// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import { html } from 'lit-html';

import { RootState } from '../application/store.ts';
import { Talk } from '../domain/talks.ts';
import { Container } from './components.ts';
import './comments.ts';

class TalksComponent extends Container<RootState, Talk[]> {
  constructor() {
    super([]);
  }

  override extractState(state: RootState): Talk[] {
    return state.talks;
  }

  getView() {
    return html`${this.getState().map((talk) => this.#talkTemplate(talk))}`;
  }

  #talkTemplate(talk: Talk) {
    return html`
      <section class="mb-4">
        <h2>
          ${talk.title}
          <button
            class="btn btn-secondary btn-sm"
          >
            Delete
          </button>
        </h2>
        <div>by <strong>${talk.presenter}</strong></div>
        <p>${talk.summary}</p>
        <s-comments .talk=${talk}></s-comments>
      </section>
    `;
  }
}

globalThis.customElements.define('s-talks', TalksComponent);
