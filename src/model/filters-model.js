import {FilterAttrs} from '../settings';

export default class FiltersModel {
  currentDate;

  everything = () => true;
  future = (point) => point.dateFrom > this.currentDate;
  present = (point) => point.dateFrom <= this.currentDate && point.dateTo >= this.currentDate;
  past = (point) => point.dateTo < this.currentDate;

  getExist = (list) => {
    const items = {};
    Object.values(FilterAttrs).forEach((item) => {
      items[item.name] = Boolean(list.find((point) => this[item.name](point)));
    });
    return items;
  };
}
