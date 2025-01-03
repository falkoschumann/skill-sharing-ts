import { html } from 'lit-html';

import { Component } from './components.ts';
import './talk_form.ts';
import './talks.ts';
import './user_field.ts';

class SkillSharingComponent extends Component {
  constructor() {
    super();
    this.className = 'd-block container py-4 px-3 mx-auto';
  }

  getView() {
    return html`
      <h1>Skill Sharing</h1>
      <s-user-field></s-user-field>
      <s-talks></s-talks>
      <s-talk-form></s-talk-form>
    `;
  }
}

globalThis.customElements.define('s-skill-sharing', SkillSharingComponent);
