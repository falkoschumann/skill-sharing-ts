// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import { html } from 'lit-html';

import { addComment } from '../application/talks_slice.ts';
import { Comment, Talk } from '../domain/talks.ts';
import { Container } from './components.ts';

class CommentsComponent extends Container {
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
      <form @submit=${(e: SubmitEvent) => this.#formSubmitted(e)} class="form">
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

  #formSubmitted(event: SubmitEvent) {
    event.preventDefault();
    const formElement = event.target as HTMLFormElement;
    if (this.#validateForm(formElement)) {
      this.#addComment(formElement);
    }
  }

  #validateForm(form: HTMLFormElement): boolean {
    form.reportValidity();
    return form.checkValidity();
  }

  #addComment(form: HTMLFormElement) {
    const formData = new FormData(form);
    this.dispatch(
      addComment({
        title: formData.get('talkTitle') as string,
        message: formData.get('comment') as string,
      }),
    );
    form.reset();
  }
}

globalThis.customElements.define('s-comments', CommentsComponent);
