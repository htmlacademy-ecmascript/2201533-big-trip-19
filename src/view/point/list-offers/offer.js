import AbstractView from '../../../framework/view/abstract-view';

export default class Offer extends AbstractView {
  #offer;

  constructor(offer) {
    super();
    this.#offer = offer;
  }

  get template() {
    return `<li class="event__offer">
      <span class="event__offer-title">${this.#offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${this.#offer.price}</span>
    </li>`;
  }
}
