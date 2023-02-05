import AbstractTrickyView from '../../abstract-tricky-view';
import Offer from './offer';

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
