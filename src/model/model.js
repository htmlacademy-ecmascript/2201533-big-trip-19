import Point from './point';
import Points from './points';
import TripInfo from './trip-info';
import Destinations from './destinations';
import Load from './load';

class Filters {
  currentDate;
  everything = () => true;
  future = (point) => point.dateFrom > this.currentDate;
  present = (point) => point.dateFrom <= this.currentDate && point.dateTo >= this.currentDate;
  past = (point) => point.dateTo < this.currentDate;
}

export default class Model {
  #info;
  #points;
  #destinations;
  #typeOfOffers = {};
  #rest;
  #filters;
  #load;
  constructor(rest) {
    this.#rest = rest;
    this.#points = new Points();
    this.#destinations = new Destinations();
    this.#info = new TripInfo();
    this.#filters = new Filters();
    this.#load = new Load(this, rest);
  }

  init = (onLoad, onError) => {
    this.#load.init(onLoad, onError);
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
      point.recalculate(this);
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
        point.recalculate(this);
      }
      this.#info.afterAlter(point, alter, point.pricePoint - pointModel.pricePoint);
      onAlter({point: pointModel, alter: alter});
    }, onError);
  };

  changeFavorite = (point, onChange) => {
    const changedPoint = point.copy;
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

  pointsFilter = (mode, currentDate) =>{
    this.#filters.currentDate = currentDate;
    const filterPoints = new Points();
    filterPoints.list = this.#points.list.filter((point) => this.#filters[mode](point));
    return filterPoints;
  };
}
