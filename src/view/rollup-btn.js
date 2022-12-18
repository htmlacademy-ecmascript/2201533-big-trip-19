import {createElement} from '../render.js';

export default class RollupButton{
  #TEMPL =
  `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`;
  #element;
  constructor(onClick) {
    this.#element = createElement(this.#TEMPL);
    this.#element.addEventListener('click', onClick)
  };
  getElement = ()=>this.#element;
}
