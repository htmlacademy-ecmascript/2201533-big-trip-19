import {createElement} from '../../framework/render';
import {FilterAttrs} from '../../settings';
import AbstractTrickyView from '../abstract-tricky-view';
import FilterItem from './filter-item';

export default class Filters extends AbstractTrickyView {
  #onChangeFilter;
  #ITEMS = [FilterAttrs.EVERYTHING, FilterAttrs.FUTURE, FilterAttrs.PRESENT, FilterAttrs.PAST];
  #inputs = [];
  #currentFilter;
  #defaultFilter;
  #defaultItem;

  constructor(changeFilter) {
    super();
    this.#onChangeFilter = changeFilter;
    this.init();
  }

  init = () => {
    super._createElement();
    this.#ITEMS.forEach((item) => {
      const elem = new FilterItem(item);
      this.element.append(elem.element);
      if (item.checked) {
        this.#currentFilter = item.name;
        this.#defaultFilter = item.name;
        this.#defaultItem = elem;
      }
      this.#inputs.push(elem.input);
    });
    this.element.addEventListener('change', (evt) => {
      this.#currentFilter = evt.target.value;
      this.#onChangeFilter(this.#currentFilter);
    });
    this.element.append(createElement('<button class="visually-hidden" type="submit">Accept filter</button>'));
  };

  start = () => {
    this.#defaultItem.checked = true;
    this.#onChangeFilter(this.#defaultFilter);
  };

  get template() {
    return '<form class="trip-filters" action="#" method="get"></form>';
  }

  set disabled(disabled) {
    this.#inputs.forEach((input) => {
      input.disabled = disabled;
    });
  }

  set disableItems(items) {
    this.#ITEMS.forEach((value, index) => {
      this.#inputs[index].element.disabled = !items[value.name];
    });
  }

  reset = () => {
    console.log('filter reset');
    if (this.#currentFilter === this.#defaultFilter) {
      return false;
    }
    this.start();
    return true;
  };
}
