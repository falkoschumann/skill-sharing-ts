// Copyright (c) 2024 Falko Schumann. All rights reserved. MIT license.

/**
 * Contains a pattern to implement custom elements with
 * [lit-html](https://lit.dev/docs/libraries/standalone-templates/).
 *
 * @module
 */

import { Action, Store, Unsubscribe } from '@reduxjs/toolkit';
import { render, TemplateResult } from 'lit-html';

export abstract class Component extends HTMLElement {
  /**
   * Updates the view after this component is inserted into the DOM.
   *
   * Called when this component is inserted into the DOM. Override this method
   * to register event listeners. Don't forget to call the super method.
   */
  connectedCallback() {
    this.updateView();
  }

  /**
   * Currently does nothing.
   *
   * Called when this component is removed from the DOM. Override this method to
   * remove event listeners. Don't forget to call the super method.
   */
  disconnectedCallback() {}

  /**
   * Updates this component.
   *
   * Renders the view into the target element.
   *
   * @see Component#getView
   * @see Component#getRenderTarget
   */
  updateView() {
    if (!this.isConnected) {
      // Skip rendering, e.g. when setting properties before inserting into DOM.
      return;
    }

    render(this.getView(), this.getRenderTarget());
  }

  /**
   * Returns the view to render when this component is updated.
   *
   * The view is a template created with `html` from lit-html. Override this
   * method to return the view. The default is an empty view.
   */
  abstract getView(): TemplateResult;

  /**
   * Returns the target element of this component to render the view into.
   *
   * The default is `this`.
   */
  getRenderTarget(): HTMLElement | DocumentFragment {
    return this;
  }
}

/**
 * Base class for custom elements that use a store.
 *
 * @template S The type of the global state.
 * @template C The type of the container's state.
 */
export abstract class Container<S = unknown, C = unknown> extends Component {
  static #store: Store;

  /**
   * Initializes the store for all containers.
   *
   * Must be call before any container is inserted into the DOM.
   *
   * @param store The store to use.
   */
  static initStore(store: Store) {
    Container.#store = store;
  }

  #state: C;
  #unsubscribeStore?: Unsubscribe;

  /**
   * Initializes this container with an initial state.
   */
  constructor(initialState: C) {
    super();
    this.#state = initialState;
  }

  /**
   * Returns the current state of the container.
   */
  getState(): C {
    return this.#state;
  }

  /**
   * Dispatches an action to the store.
   *
   * @param action The action to dispatch.
   */
  dispatch(action: Action) {
    Container.#store.dispatch(action);
  }

  /**
   * Subscribes to the store and update the view when the state changes.
   *
   * Don't forget to call the super method when overriding this method.
   */
  override connectedCallback() {
    this.#unsubscribeStore = Container.#store.subscribe(() =>
      this.updateView()
    );
    super.connectedCallback();
  }

  /**
   * Unsubscribes from the store.
   *
   * Don't forget to call the super method when overriding this method.
   */
  override disconnectedCallback() {
    this.#unsubscribeStore?.();
    super.disconnectedCallback();
  }

  /**
   * Updates this container with the current state from the store before
   * updating the view.
   */
  override updateView() {
    this.#state = this.extractState(Container.#store.getState() as S);
    super.updateView();
  }

  /**
   * Extracts a subset of the state for this container.
   *
   * Default is the entire state.
   *
   * @param state The state of the store.
   * @return The state for the container.
   */
  extractState(state: S): C {
    return state as unknown as C;
  }
}
