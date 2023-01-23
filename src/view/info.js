import {createElement} from '../framework/render';
import AbstractTrickyView from './abstract-tricky-view';

export default class Info extends AbstractTrickyView{
  #infoContainer;
  #costContainer;
  #title;
  #dates;
  #cost;

  constructor() {
    super();
    this.#infoContainer = createElement('<div class="trip-info__main"></div>');
    this.#costContainer = createElement('<p class="trip-info__cost">Total: € </p>');
    this.#title = createElement('<h1 class="trip-info__title"></h1>');
    this.#dates = createElement('<p class="trip-info__dates"></p>');
    this.#cost = createElement('<span class="trip-info__cost-value"></span>');
    this._createElement();
  }

  _createElement = () => {
    super._createElement();
    this.#infoContainer.append(this.#title);
    this.#infoContainer.append(this.#dates);
    this.#costContainer.append(this.#cost);
    this.element.append(this.#infoContainer);
    this.element.append(this.#costContainer);
  };

  set data(dataInfo) {
    this.#title.textContent = dataInfo.title;
    this.#dates.textContent = dataInfo.date;
    this.#cost.textContent = dataInfo.price;
  }

  get template() {
    return '<section class="trip-main__trip-info  trip-info"></section>';
  }
}
