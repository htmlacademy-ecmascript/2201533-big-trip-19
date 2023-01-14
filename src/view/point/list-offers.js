import {createElement, createElementSan} from '../render';

class Offer {
  #TEMPLATE;
  #element;

  constructor(offer) {
    this.#TEMPLATE =
      `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`;
    this.#element = createElementSan(this.#TEMPLATE);
  }

  getElement = () => this.#element;
}

export default class ListOffers {
  #TEMPLATE = '<ul class="event__selected-offers"></ul>';
  #element;

  constructor(offers) {
    this.#element = createElement(this.#TEMPLATE);
    offers.forEach((offer) => {
      this.#element.append(new Offer(offer).getElement());
    });
  }

  getElement = () => this.#element;
}
