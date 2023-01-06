import {createElement} from '../render';

export default class Info{
  #element;
  #infoContainer;
  #costContainer;
  #title;
  #dates;
  #cost;
  set data(dataInfo){
    this.#title.textContent = dataInfo.title;
    this.#dates.textContent = dataInfo.date;
    this.#cost.textContent = dataInfo.price;
  }
  constructor() {
    this.#infoContainer = createElement(`<div class="trip-info__main"></div>`);
    this.#costContainer = createElement(`<p class="trip-info__cost">Total: € </p>`);
    this.#title = createElement(`<h1 class="trip-info__title"></h1>`);
    this.#dates = createElement(`<p class="trip-info__dates"></p>`);
    this.#cost = createElement(`<span class="trip-info__cost-value"></span>`);
    this.#element = createElement(`<section class="trip-main__trip-info  trip-info"></section>`);
    this.#infoContainer.append(this.#title);
    this.#infoContainer.append(this.#dates);
    this.#costContainer.append(this.#cost);
    this.#element.append(this.#infoContainer);
    this.#element.append(this.#costContainer);
  }
  getElement = ()=>this.#element;
}
