import AbstractView from '../../framework/view/abstract-view';
import AbstractTrickyView from '../abstract-tricky-view';

class Price extends AbstractView {
  get template() {
    return '<span class="event__price-value"></span>';
  }
}

export default class PriceBlock extends AbstractTrickyView {
  #price;

  constructor() {
    super();
    this.#price = new Price();
    this._createElement();
  }

  _createElement = () => {
    super._createElement();
    this.element.append(this.#price.element);
  };

  get template() {
    return '<p class="event__price">&euro;&nbsp;</p>';
  }

  set price(price) {
    this.#price.element.textContent = price;
  }
}
