import {newPointFromJson} from './from-json';
import {ORDER} from '../setings';
import dayjs from 'dayjs';

export default class Points{
  #list = [];

  constructor() {

  };

  get list(){return this.#list};
  set list(list){this.#list = list};

  fillJson(json){
    json.forEach((point) => this.list.push(newPointFromJson(point)));
  }

  delete(id){
    this.#list.splice(this.#list.findIndex((point)=>point.id === id), 1);
  };

  find(id){return this.#list.find(element=>element.id === id)}

  add(point){
    this.#list.push(point);
  };

  get length(){return this.#list.length};

  sort = {
    dateFor: (order = ORDER.up) => this.#list.sort((a, b) =>
      (a.dateFrom === b.dateFrom ? 0 : a.dateFrom > b.dateFrom ? 1 : -1) * order),

    dateTo: (order = ORDER.up) => this.#list.sort((a, b) =>
      (a.dateTo === b.dateTo ? 0 : a.dateTo > b.dateTo ? 1 : -1) * order),

    duration: (order = ORDER.up) => this.#list.sort((a, b) =>{
        const diff = a.dateTo.diff(a.dateFrom) - b.dateTo.diff(b.dateFrom);
        // console.log(a.dateTo.diff(a.dateFrom));
        // const diffB = b.dateTo.diff(b.dateFrom);
        // console.log(b.dateTo.diff(b.dateFrom));
        return (diff === 0 ? 0 : diff > 0 ? 1 : -1) * order;
      }
    ),

    basePrice: (order = ORDER.up) => this.#list.sort((a, b) =>
      (a.basePrice === b.basePrice ? 0 : a.basePrice > b.basePrice ? 1 : -1) * order),

    day: (order) => this.sort.dateFor(order),

    time: (order) => this.sort.duration(order),

    price: (order) => this.sort.basePrice(order),
  };
}
