import AbstractView from '../framework/view/abstract-view';
import {createElement} from '../framework/render';

export default class AbstractTrickyView extends AbstractView {
  #element;

  _createElement() {
    this.#element = createElement(this.template);
  }

  get element(){
    if (!this.#element) {
      this._createElement();
    }
    return this.#element;
  }
}
