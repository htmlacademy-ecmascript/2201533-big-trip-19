import Offer from './offer';

export default class LoadData {
  #isLoaded = {
    points: false,
    destinations: false,
    offers: false
  };

  #model;
  #loadErrors = [];
  #onLoad;
  #rest;

  constructor(model, rest) {
    this.#model = model;
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
    this.#isLoaded.points = true;
    if (this.#checkLoadedData()) {
      this.#onLoad();
    }
  };

  destinations = (json) => {
    this.#model.destinations.fillJson(json);
    this.#isLoaded.destinations = true;
    if (this.#checkLoadedData()) {
      this.#onLoad();
    }
  };

  offers = (json) => {
    json.forEach((type) => {
      this.#model.typeOfOffers[type.type] =
        Array.from(type.offers, (offer) => new Offer(offer.id, offer.title, offer.price));
    });
    this.#isLoaded.offers = true;
    if (this.#checkLoadedData()) {
      this.#onLoad();
    }
  };

  #onErrorLoad = (msg) => {
    this.#loadErrors.push(msg);
    this.#isLoaded[msg.endpoint] = true;
    if (this.#checkLoadedData()) {
      this.#onLoad();
    }
  };

  #checkLoadedData = () => this.#isLoaded.points && this.#isLoaded.destinations && this.#isLoaded.offers;
}
