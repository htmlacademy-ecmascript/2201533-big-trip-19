import {createElement} from '../framework/render';
import AbstractTrickyView from './abstract-tricky-view';

export default class Info extends AbstractTrickyView{
  #infoContainer = createElement('<div class="trip-info__main"></div>');
  #costContainer = createElement('<p class="trip-info__cost">Total: € </p>');
  #title = createElement('<h1 class="trip-info__title"></h1>');
  #dates = createElement('<p class="trip-info__dates"></p>');
  #cost = createElement('<span class="trip-info__cost-value"></span>');

  constructor() {
    super();
    this.init();
  }

  init = () => {
    super._createElement();
    this.#infoContainer.append(this.#title);
    this.#infoContainer.append(this.#dates);
    this.#costContainer.append(this.#cost);
    this.element.append(this.#infoContainer);
    this.element.append(this.#costContainer);
  };

  get template() {
    return '<section class="trip-main__trip-info  trip-info"></section>';
  }

  set data(dataInfo) {
    this.#title.textContent = dataInfo.title;
    this.#dates.textContent = dataInfo.date;
    this.#cost.textContent = dataInfo.price;
  }
}
