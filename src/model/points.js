import {newPointFromJson} from './from-json';
import {FILL_POINTS, FormFields} from '../settings';

export default class Points {
  #list = [];
  #sortMode;

  get length() {
    return this.#list.length;
  }

  get start() {
    const list = Array.from(this.#list, (v, k) => ({key: k, date: v.dateFrom}));
    list.sort((a, b) => this.#compare(a.date, b.date));
    return this.#list[list[0].key];
  }

  get end() {
    const list = Array.from(this.#list, (v, k) => ({key: k, date: v.dateFrom}));
    list.sort((a, b) => this.#compare(b.date, a.date));
    return this.#list[list[0].key];
  }

  get list() {
    return this.#list;
  }

  set list(list) {
    this.#list = list;
  }

  #compare = (a, b, field) => {
    let diff;
    switch(field) {
      case FormFields.DURATION:
        diff = a.dateTo.diff(a.dateFrom) - b.dateTo.diff(b.dateFrom);
        break;
      case FormFields.PRICE:
        diff = a.basePrice - b.basePrice;
        break;
      case FormFields.DATE_FROM:
        diff = a.dateFrom.diff(b.dateFrom);
        break;
      default:
        diff = a.diff(b);
    }
    return Math.round(diff / Math.abs(diff));
  };

  fillJson = (json) => {
    if (FILL_POINTS){
      json.forEach((point) => this.list.push(newPointFromJson(point)));
    }
  };

  delete = (id) => {
    this.#list.splice(this.#list.findIndex((point) => point.id === id), 1);
  };

  findID = (id) => this.#list.find((element) => element.id === id);

  add = (point) => {
    this.#list.push(point);
  };

  relocation = (point, changes) => {
    if (changes.includes(this.#sortMode.field))
    {
      const options = {};
      const deleteIndex = this.#list.findIndex((element) => element.id === point.id);
      options.delete = this.#list[deleteIndex].id;
      this.#list.splice(deleteIndex, 1);
      const beforeIndex = this.#list.findIndex((element) =>
        this.#compare(element, point, this.#sortMode.field) * this.#sortMode.order === 1);
      options.before = beforeIndex === -1 ? false : this.#list[beforeIndex].id;
      this.#list.splice(beforeIndex, 0, point);
      return options;
    }
    return false;
  };

  sort = (options) => {
    this.#sortMode = options;
    this.#list.sort((a, b) => this.#compare(a, b, options.field) * options.order);
  };
}
