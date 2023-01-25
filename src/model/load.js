import Offer from './offer';

class Loaded {
  points = false;
  destinations = false;
  offers = false;
  check = () => this.points && this.destinations && this.offers;
}

export default class Load {
  #loaded;
  #model;
  #loadErrors = [];
  #onLoad;
  #rest;
  constructor(model, rest) {
    this.#model = model;
    this.#loaded = new Loaded();
    this.#rest = rest;
  }

  init = (onLoad, onError) => {
    this.#onLoad = () => {
      if (this.#loadErrors.length > 0) {
        onError(this.#loadErrors);
      } else {
        this.#model.info.recalculate(this.#model);
        onLoad();
      }
    };
    this.#rest.GET.points(this.points, this.#onErrorLoad);
    this.#rest.GET.destinations(this.destinations, this.#onErrorLoad);
    this.#rest.GET.offers(this.offers, this.#onErrorLoad);
  };

  points = (json) => {
    this.#model.points.fillJson(json);
    this.#model.info.init(this.#model);
    this.#loaded.points = true;
    if (this.#loaded.check()) {
      this.#onLoad();
    }
  };

  destinations = (json) => {
    this.#model.destinations.fillJson(json);
    this.#loaded.destinations = true;
    if (this.#loaded.check()) {
      this.#onLoad();
    }
  };

  offers = (json) => {
    json.forEach((type) => {
      this.#model.typeOfOffers[type.type] =
        Array.from(type.offers, (offer) => new Offer(offer.id, offer.title, offer.price));
    });
    this.#loaded.offers = true;
    if (this.#loaded.check()) {
      this.#onLoad();
    }
  };

  #onErrorLoad = (msg) => {
    this.#loadErrors.push(msg);
    this.#loaded[msg.endpoint] = true;
    if (this.#loaded.check()) {
      this.#onLoad();
    }
  };
}
