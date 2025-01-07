// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import { html } from 'lit-html';

import { RootState } from '../application/store.ts';
import { User } from '../domain/user.ts';
import { Container } from './components.ts';

class UserFieldComponent extends Container<RootState, User | undefined> {
  constructor() {
    super(undefined);
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
        />
      </div>
    `;
  }
}

globalThis.customElements.define('s-user-field', UserFieldComponent);
