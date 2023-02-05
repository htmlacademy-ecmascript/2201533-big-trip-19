import AbstractView from '../../framework/view/abstract-view';
import AbstractTrickyView from '../abstract-tricky-view';

class Offer extends AbstractView {
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

export default class ListOffers extends AbstractTrickyView {
  constructor(offers) {
    super();
    this.init(offers);
  }

  init = (offers) => {
    super._createElement();
    offers.forEach((offer) => {
      this.element.append(new Offer(offer).element);
    });
  };

  get template() {
    return '<ul class="event__selected-offers"></ul>';
  }
}
