import AbstractView from '../../framework/view/abstract-view';
import AbstractTrickyView from '../abstract-tricky-view';
import {Icons} from '../../settings';

class TypeIcon extends AbstractView {
  get template() {
    return '<img class="event__type-icon" width="42" height="42" src="#" alt="Event type icon">';
  }
}

export default class TypeBlock extends AbstractTrickyView {
  #icon;

  constructor() {
    super();
    this.#icon = new TypeIcon();
    this.init();
  }

  init = () => {
    super._createElement();
    this.element.append(this.#icon.element);
  };

  get template() {
    return '<div class="event__type"></div>';
  }

  set type(type) {
    this.#icon.element.src = `${Icons.PATH}${type}${Icons.EXT}`;
  }
}
