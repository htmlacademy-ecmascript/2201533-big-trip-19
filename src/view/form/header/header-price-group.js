import {createElement} from '../../../framework/render';
import AbstractTrickyView from '../../abstract-tricky-view';

export default class HeaderPriceGroup extends AbstractTrickyView {
  onChange;
  #input;

  constructor() {
    super();
    this._createElement();
  }

  _createElement = () => {
    super._createElement();
    this.#input = createElement(`<input class="event__input  event__input--price" id="event-price"
      type="text" name="event-price" value="0">`);
    this.#input.addEventListener('change', () => {
      this.onChange(parseInt(this.#input.value, 10));
    });
    this.#input.addEventListener('input', () => {
      this.#input.value = this.#input.value ? parseInt(this.#input.value.replace(/\D/, ''), 10) : 0;
    });
    this.element.append(this.#input);
  };

  set price(price) {
    this.#input.value = price;
  }

  set disabled(disabled) {
    this.#input.disabled = disabled;
  }

  get template() {
    return `<div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
    </div>
    `;
  }
}
