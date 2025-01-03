import { html } from 'lit-html';

import { Component } from './components.ts';

class TalkFormComponent extends Component {
  getView() {
    return html`
      <form>
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
}

globalThis.customElements.define('s-talk-form', TalkFormComponent);
