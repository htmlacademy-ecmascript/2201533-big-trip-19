import {createElement} from './render';
import {FilterAttrs} from '../settings';

class FilterItemLabel {
  #TEMPLATE = '<label class="trip-filters__filter-label">Future</label>';
  #element;

  constructor(attr, id) {
    this.#element = createElement(this.#TEMPLATE);
    this.#element.htmlFor = id;
    this.#element.textContent = attr.title;
  }

  getElement = () => this.#element;
}

class FilterItemInput {
  #TEMPLATE = '<input class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter">';
  #element;

  constructor(attr, id) {
    this.#element = createElement(this.#TEMPLATE);
    this.#element.id = id;
    this.#element.value = attr.name;
    this.#element.checked = attr.checked;
  }

  getElement = () => this.#element;
}

class FilterItem {
  #ID_PREF = 'filter-';
  #TEMPLATE = '<div class="trip-filters__filter"></div>';
  #element;
  #input;

  constructor(item) {
    const id = `${this.#ID_PREF}${item.name}`;
    this.#input = new FilterItemInput(item, id).getElement();
    this.#element = createElement(this.#TEMPLATE);
    this.#element.append(this.#input);
    const label = new FilterItemLabel(item, id).getElement();
    this.#element.append(label);
  }

  getElement = () => this.#element;

  get input() {
    return this.#input;
  }

  checked = () => {
    this.#input.checked = true;
  };
}

export default class Filters {
  #onChangeFilter;
  #ITEMS = [FilterAttrs.EVERYTHING, FilterAttrs.FUTURE, FilterAttrs.PRESENT, FilterAttrs.PAST];
  #inputs = [];
  #currentFilter;
  #defaultFilter;
  #defaultItem;
  #TEMPLATE = '<form class="trip-filters" action="#" method="get"></form>';
  #element;

  constructor(changeFilter) {
    this.#onChangeFilter = changeFilter;
    this.#element = createElement(this.#TEMPLATE);
    this.#ITEMS.forEach((item) => {
      const elem = new FilterItem(item);
      this.#element.append(elem.getElement());
      if (item.checked) {
        this.#currentFilter = item.name;
        this.#defaultFilter = item.name;
        this.#defaultItem = elem;
      }
      this.#inputs.push(elem.input);
    });
    this.#element.addEventListener('change', (evt) => {
      this.#currentFilter = evt.target.value;
      this.#onChangeFilter(this.#currentFilter);
    });
    this.#element.append(createElement('<button class="visually-hidden" type="submit">Accept filter</button>'));
  }

  init() {
    this.#defaultItem.checked();
    this.#onChangeFilter(this.#defaultFilter);
  }

  reset = () => {
    if (this.#currentFilter === this.#defaultFilter) {
      return false;
    }
    this.init();
    return true;
  };

  set disabled(disabled) {
    this.#inputs.forEach((input) => {
      input.disabled = disabled;
    });
  }

  getElement = () => this.#element;
}
