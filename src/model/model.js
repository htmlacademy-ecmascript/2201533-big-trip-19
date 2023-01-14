import Point from './point';
import Points from './points';
import TripInfo from './trip-info';
import Destinations from './destinations';

class Offer {
  constructor(id, title, price) {
    this.id = id;
    this.title = title;
    this.price = price;
  }
}

export default class Model {
  #info;
  #points;
  #destinations = [];
  #typeOfOffers = {};
  #rest;
  #loadErrors = [];
  #onLoad;
  #loaded = {
    points: false,
    destinations: false,
    offers: false,
    check: () => this.#loaded.points && this.#loaded.destinations && this.#loaded.offers
  };

  #filters = {
    everything: () => true,
    future: (point) => point.dateFrom > this.#filters.currentDate,
    present: (point) => point.dateFrom <= this.#filters.currentDate && point.dateTo >= this.#filters.currentDate,
    past: (point) => point.dateTo < this.#filters.currentDate
  };

  constructor(rest) {
    this.#rest = rest;
    this.#points = new Points();
    this.#destinations = new Destinations();
    this.#info = new TripInfo();
  }

  init = (onLoad, onError) => {
    this.#onLoad = () => {
      if (this.#loadErrors.length > 0) {
        onError(this.#loadErrors);
      } else {
        this.#info.recalc(this);
        onLoad();
      }
    };
    this.#rest.GET.points(this.#load.points, this.#onErrorLoad);
    this.#rest.GET.destinations(this.#load.destinations, this.#onErrorLoad);
    this.#rest.GET.offers(this.#load.offers, this.#onErrorLoad);
  };

  #load = {
    points: (json) => {
      this.#points.fillJson(json);
      this.#info.init(this);
      this.#loaded.points = true;
      if (this.#loaded.check()) {
        this.#onLoad();
      }
    },

    destinations: (json) => {
      this.#destinations.fillJson(json);
      this.#loaded.destinations = true;
      if (this.#loaded.check()) {
        this.#onLoad();
      }
    },

    offers: (json) => {
      json.forEach((type) => {
        this.#typeOfOffers[type.type] =
          Array.from(type.offers, (offer) => new Offer(offer.id, offer.title, offer.price));
      });
      this.#loaded.offers = true;
      if (this.#loaded.check()) {
        this.#onLoad();
      }
    }
  };

  #onErrorLoad = (msg) => {
    this.#loadErrors.push(msg);
    this.#loaded[msg.endpoint] = true;
    if (this.#loaded.check()) {
      this.#onLoad();
    }
  };

  get destinations() {
    return this.#destinations;
  }

  get types() {
    return Object.keys(this.#typeOfOffers);
  }

  get typeOfOffers() {
    return this.#typeOfOffers;
  }

  get points() {
    return this.#points;
  }

  get info() {
    return this.#info;
  }

  getOffers = (type, offers) =>
    Array.from(offers, (id) => this.#typeOfOffers[type].find((element) => element.id === id));

  getPoint = (id) => id > -1 ? this.#points.findID(id) : new Point();

  post = (point, onAdd, onError) => {
    this.#rest.POST(point.localPoint, (resp) => {
      point.id = parseInt(resp.id, 10);
      this.#points.add(point);
      point.recalc(this);
      this.#info.afterAdd(point);
      onAdd({point: point});
    }, onError);
  };

  put = (point, onAlter, onError) => {
    const pointModel = this.getPoint(point.id);
    if (pointModel.equal(point)) {
      return true;
    }
    this.#rest.PUT(point, () => {
      const alter = pointModel.alter(point);
      if (alter.includes('basePrice') || alter.includes('offers')) {
        point.recalc(this);
      }
      this.#info.afterAlter(point, alter, point.pricePoint - pointModel.pricePoint);
      onAlter({point: pointModel, alter: alter});
    }, onError);
  };

  changeFavorite = (point, onChange) => {
    const changedPoint = point.copy();
    changedPoint.isFavorite = !point.isFavorite;
    this.#rest.PUT(changedPoint, () => {
      point.isFavorite = !point.isFavorite;
      onChange(point);
    });
  };

  deletePoint = (point, onDelete, onError) => {
    const id = point.id;
    this.#rest.DELETE(id, () => {
      this.#points.delete(id);
      this.#info.afterDelete(point);
      onDelete({id: id});
    }, onError);
  };

  pointsFilter = (mode, currentDate) => {
    this.#filters.currentDate = currentDate;
    const filterPoints = new Points();
    filterPoints.list = this.#points.list.filter((point) => this.#filters[mode](point));
    return filterPoints;
  };
}
