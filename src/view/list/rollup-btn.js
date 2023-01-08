import {createElement} from '../render.js';

export default class RollupButton {
  #TEMPL =
    `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`;

  #element;

  constructor() {
    this.#element = createElement(this.#TEMPL);
  }

  render(parent) {
    parent.append(this.#element);
  }

  remove() {
    this.#element.remove();
  }

  getElement = () => this.#element;
}
