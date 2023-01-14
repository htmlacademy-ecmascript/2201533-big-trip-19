import {createElement} from '../render.js';

export default class RollupButton {
  #TEMPLATE =
    `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`;

  #element;

  constructor() {
    this.#element = createElement(this.#TEMPLATE);
  }

  render(parent) {
    parent.append(this.#element);
  }

  remove() {
    this.#element.remove();
  }

  getElement = () => this.#element;
}
