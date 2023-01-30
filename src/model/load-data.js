import Offer from './offer';

export default class LoadData {
  #model;
  #loadErrors = [];
  #rest;

  constructor(model, rest) {
    this.#model = model;
    this.#rest = rest;
  }

  init = (onLoad, onError) => {
    this.#rest.GET(this)
      .then((response) => {
        if(response.every((value) => value)) {
          this.#model.info.recalculate(this.#model);
          onLoad();
        } else {
          onError(this.#loadErrors);
        }
      })
      .catch((msg) => onError([msg]));
  };

  points = (json) => {
    this.#model.points.fillJson(json);
    this.#model.info.init(this.#model);
  };

  destinations = (json) => {
    this.#model.destinations.fillJson(json);
  };

  offers = (json) => {
    json.forEach((type) => {
      this.#model.typeOfOffers[type.type] =
        Array.from(type.offers, (offer) => new Offer(offer.id, offer.title, offer.price));
    });
  };

  addError = (msg) => {
    this.#loadErrors.push(msg);
  };
}
