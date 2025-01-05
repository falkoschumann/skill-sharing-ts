// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import { html } from 'lit-html';

import { Comment, Talk } from '../domain/talks.ts';
import { Component } from './components.ts';

class CommentsComponent extends Component {
  #talk?: Talk;

  get talk() {
    return this.#talk;
  }

  set talk(value) {
    this.#talk = value;
    this.updateView();
  }

  getView() {
    if (!this.talk) {
      return html``;
    }

    return html`
      <ul class="list-group mb-3">
        ${
      this.talk.comments.map(
        (comment: Comment) =>
          html`
                <li class="list-group-item">
                  <strong>${comment.author}</strong>: ${comment.message}
                </li>
              `,
      )
    }
      </ul>
      <form class="form">
        <div class="mb-3">
          <input
            type="text"
            hidden
            name="talkTitle"
            value="${this.talk.title}"
          />
          <input type="text" required name="comment" class="form-control"/>
        </div>
        <button type="submit" class="btn btn-primary">Add comment</button>
      </form>
    `;
  }
}

globalThis.customElements.define('s-comments', CommentsComponent);
