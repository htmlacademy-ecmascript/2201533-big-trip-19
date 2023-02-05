import Offer from './offer';

export default class LoadData {
  #model;
  #loadingErrors = [];
  #rest;

  constructor(model, rest) {
    this.#model = model;
    this.#rest = rest;
  }

  start = (onLoad, onError) => {
    this.#rest.GET(this)
      .then((response) => {
        if(response.every((value) => value)) {
          this.#model.info.recalculate();
          onLoad();
        } else {
          onError(this.#loadingErrors);
        }
      })
      .catch((msg) => onError([msg]));
  };

  set points(jsonListPoints) {
    this.#model.points.fillJson(jsonListPoints);
    this.#model.info.setParams();
  }

  set destinations(jsonListDestinations) {
    this.#model.destinations.fillJson(jsonListDestinations);
  }

  set offers(jsonListTypeEvents) {
    jsonListTypeEvents.forEach((list) => {
      this.#model.typeOfOffers[list.type] =
        Array.from(list.offers, (offer) => new Offer(offer.id, offer.title, offer.price));
    });
  }

  addError = (msg) => {
    this.#loadingErrors.push(msg);
  };
}
