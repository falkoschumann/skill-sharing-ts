// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

import { html } from 'lit-html';

import { store } from '../application/store.ts';
import { connect } from '../application/talks_slice.ts';
import { loadUser } from '../application/user_slice.ts';
import { Container } from './components.ts';
import './talk_form.ts';
import './talks.ts';
import './user_field.ts';

Container.initStore(store);

class SkillSharingComponent extends Container {
  constructor() {
    super();
    this.className = 'd-block container py-4 px-3 mx-auto';
  }

  override connectedCallback() {
    super.connectedCallback();

    this.dispatch(loadUser());
    this.dispatch(connect());
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
