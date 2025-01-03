import { html } from 'lit-html';

import { Component } from './components.ts';

class UserFieldComponent extends Component {
  constructor() {
    super();
    this.className = 'd-block mb-4';
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
          value="Anon"
        />
      </div>
    `;
  }
}

globalThis.customElements.define('s-user-field', UserFieldComponent);
