// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import { html } from 'lit-html';

import { RootState } from '../application/store.ts';
import { User } from '../domain/user.ts';
import { Container } from './components.ts';
import { changeUser } from '../application/user_slice.ts';

class UserFieldComponent extends Container<RootState, User | undefined> {
  constructor() {
    super();
    this.className = 'd-block mb-4';
  }

  override extractState(state: RootState): User {
    return state.user;
  }

  getView() {
    return html`
      <div class="mb-3">
        <label for="username" class="form-label">Your name</label>
        <input
          type="text"
          id="username"
          name="username"
          autocomplete="username"
          class="form-control"
          .value="${this?.getState()?.username}"
          @change=${(e: InputEvent) => this.#changeUser(e)}
        />
      </div>
    `;
  }

  #changeUser(event: InputEvent) {
    const inputElement = event.target as HTMLInputElement;
    this.dispatch(changeUser({ username: inputElement.value }));
  }
}

globalThis.customElements.define('s-user-field', UserFieldComponent);
