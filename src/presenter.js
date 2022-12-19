import Sorting from './view/sorting.js';
import Filters from './view/filters.js';
import Info from './view/info.js';
import {render, RenderPosition} from './render.js';

export default class Presenter{
  #sort;
  #filter;
  #info;
  #model;
  constructor(model) {
    this.#model = model;
    this.#sort = new Sorting();
    this.#filter = new Filters();
    this.#info = new Info();
  };
  start = ()=>{
    const sortContainer = document.querySelector('.trip-events');
    render(sort, sortContainer);
    const filterContainer = document.querySelector('.trip-controls__filters');
    render(filter, filterContainer);
    const infoContainer = document.querySelector('.trip-main');
    render(info, infoContainer, RenderPosition.AFTERBEGIN);
    const eventAddButton = document.querySelector('.trip-main__event-add-btn');
  }
}
