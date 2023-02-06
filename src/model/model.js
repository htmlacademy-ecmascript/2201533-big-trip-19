import Point from './point';
import Points from './points';
import TripInfo from './trip-info';
import Destinations from './destinations';
import LoadData from './load-data';
import FiltersModel from './filters-model';
import dayjs from 'dayjs';
import {FormFields} from '../settings';

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
    this.#info = new TripInfo(this);
    this.#filters = new FiltersModel();
    this.#load = new LoadData(this, rest);
  }

  start = (onLoad, onError) => {
    this.#load.start(onLoad, onError);
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

  get existFilters() {
    this.#filters.currentDate = dayjs();
    return this.#filters.getExist(this.#points.list);
  }

  getOffers = (type, offers) =>
    Array.from(offers, (id) => this.#typeOfOffers[type].find((element) => element.id === id));

  getPoint = (id) => id > -1 ? this.#points.findID(id) : new Point();

  post = (point, onAdd, onError) => {
    this.#rest.post(point.forPOST, (response) => {
      point.id = parseInt(response.id, 10);
      this.#points.add(point);
      point.recalculate(this);
      this.#info.doAfterAdding(point);
      onAdd({point: point});
    }, onError);
  };

  put = (point, onAlter, onError) => {
    const pointModel = this.getPoint(point.id);
    if (pointModel.isEqual(point)) {
      return true;
    }
    this.#rest.put(point, () => {
      const changes = pointModel.alter(point);
      let delta = 0;
      if (changes.has(FormFields.PRICE) || changes.has(FormFields.OFFERS)) {
        point.recalculate(this);
        delta = point.fullPrice - pointModel.fullPrice;
        pointModel.fullPrice = point.fullPrice;
      }
      this.#info.doAfterAlterations(point, changes, delta);
      onAlter({point: pointModel, changes: changes});
    }, onError);
  };

  changeFavorite = (point, onChange) => {
    const changedPoint = point.copy;
    changedPoint.isFavorite = !point.isFavorite;
    this.#rest.put(changedPoint, () => {
      point.isFavorite = !point.isFavorite;
      onChange(point);
    }, () => {
    });
  };

  deletePoint = (point, onDelete, onError) => {
    const id = point.id;
    this.#rest.delete(id, () => {
      this.#points.delete(id);
      this.#info.doAfterDeleting(point);
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
