// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import { html } from 'lit-html';

import { submitTalk } from '../application/talks_slice.ts';
import { Container } from './components.ts';

class TalkFormComponent extends Container {
  getView() {
    return html`
      <form @submit=${(event: SubmitEvent) => this.#formSubmitted(event)}>
        <h3>Submit a Talk</h3>
        <div class="mb-3">
          <label for="title" class="form-label">Title:</label>
          <input
            type="text"
            required
            id="title"
            name="title"
            class="form-control"
          />
        </div>
        <div class="mb-3">
          <label for="summary" class="form-label">Summary:</label>
          <textarea
            rows="6"
            cols="30"
            required
            id="summary"
            name="summary"
            class="form-control"
          ></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    `;
  }

  #formSubmitted(event: SubmitEvent) {
    event.preventDefault();
    const formElement = event.target as HTMLFormElement;
    if (this.#validateForm(formElement)) {
      this.#submitTalk(formElement);
    }
  }

  #validateForm(form: HTMLFormElement): boolean {
    form.reportValidity();
    return form.checkValidity();
  }

  #submitTalk(form: HTMLFormElement) {
    const formData = new FormData(form);
    this.dispatch(
      submitTalk({
        title: formData.get('title') as string,
        summary: formData.get('summary') as string,
      }),
    );
    form.reset();
  }
}

globalThis.customElements.define('s-talk-form', TalkFormComponent);
