import {newPointFromJson} from './from-json';
import {FILL_POINTS} from '../settings';

export default class Points {
  #list = [];
  #options;

  //constructor() {}

  get length() {
    return this.#list.length;
  }

  get start() {
    const list = Array.from(this.#list, (v, k) => ({key: k, date: v.dateFrom}));
    list.sort((a, b) => this.#compare.date(a.date, b.date));
    return this.#list[list[0].key];
  }

  get end() {
    const list = Array.from(this.#list, (v, k) => ({key: k, date: v.dateFrom}));
    list.sort((a, b) => this.#compare.date(b.date, a.date));
    return this.#list[list[0].key];
  }

  get list() {
    return this.#list;
  }

  set list(list) {
    this.#list = list;
  }

  #compare = {
    date: (a, b) => {
      const diff = a.diff(b);
      return Math.round(diff / Math.abs(diff));
    },
    dateFrom: (a, b) => this.#compare.date(a.dateFrom, b.dateFrom),
    dateTo: (a,b) => this.#compare.date(a.dateTo, b.dateTo),
    duration: (a, b) => {
      const diff = a.dateTo.diff(a.dateFrom) - b.dateTo.diff(b.dateFrom);
      return Math.round(diff / Math.abs(diff));
    },
    basePrice: (a, b) => {
      const diff = a.basePrice - b.basePrice;
      return Math.round(diff / Math.abs(diff));
    }
  };

  fillJson(json) {
    if (FILL_POINTS){
      json.forEach((point) => this.list.push(newPointFromJson(point)));
    }
  }

  delete(id) {
    this.#list.splice(this.#list.findIndex((point) => point.id === id), 1);
  }

  findID(id) {
    return this.#list.find((element) => element.id === id);
  }

  add(point) {
    this.#list.push(point);
  }

  relocation(point, alter){
    if (alter.includes(this.#options.field.field))
    {
      const options = {};
      const deleteIndex = this.#list.findIndex((element) => element.id === point.id);
      options.delete = this.#list[deleteIndex].id;
      this.#list.splice(deleteIndex, 1);
      const beforeIndex = this.#list.findIndex((element) =>
        this.#compare[this.#options.field.field](element, point) * this.#options.order === 1);
      options.before = beforeIndex === -1 ? false : this.#list[beforeIndex].id;
      this.#list.splice(beforeIndex, 0, point);
      return options;
    }
    return false;
  }

  sort(options){
    this.#options = options;
    this.#list.sort((a, b) => this.#compare[options.field.field](a, b) * options.order);
  }
}
