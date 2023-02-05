import AbstractTrickyView from '../../abstract-tricky-view';
import {Icons} from '../../../settings';
import TypeIcon from './type-icon-view';

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
