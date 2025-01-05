// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import { html } from 'lit-html';

import { Talk } from '../domain/talks.ts';
import { Component } from './components.ts';
import './comments.ts';

class TalksComponent extends Component {
  getView() {
    return html`${
      [
        {
          'title': 'Foobar',
          'presenter': 'Anon',
          'summary': 'Lorem ipsum.',
          'comments': [
            {
              'author': 'Bob',
              'message': 'Great!',
            },
            {
              'author': 'Anon',
              'message': 'Thanks!',
            },
          ],
        },
      ].map((talk) => this.#talkTemplate(talk))
    }`;
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
