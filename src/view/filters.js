import {createElement} from './render';
import {FilterAttrs} from '../setings';

class FilterItemLabel {
  #TEMPL = '<label class="trip-filters__filter-label">Future</label>';
  #element;

  constructor(attr, id) {
    this.#element = createElement(this.#TEMPL);
    this.#element.htmlFor = id;
    this.#element.textContent = attr.title;
  }

  getElement = () => this.#element;
}

class FilterItemInput {
  #TEMPL = '<input class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter">';
  #element;

  constructor(attr, id) {
    this.#element = createElement(this.#TEMPL);
    this.#element.id = id;
    this.#element.value = attr.name;
    this.#element.checked = attr.checked;
  }

  getElement = () => this.#element;
}

class FilterItem {
  #ID_PREF = 'filter-';
  #TEMPL = '<div class="trip-filters__filter"></div>';
  #element;
  #input;
  checked = () => {
    this.#input.checked = true;
  };

  constructor(item) {
    const id = `${this.#ID_PREF}${item.name}`;
    this.#input = new FilterItemInput(item, id).getElement();
    this.#element = createElement(this.#TEMPL);
    this.#element.append(this.#input);
    const label = new FilterItemLabel(item, id).getElement();
    this.#element.append(label);
  }

  getElement = () => this.#element;
}

export default class Filters {
  #onChangeFilter;
  #ITEMS = [FilterAttrs.EVERYTHING, FilterAttrs.FUTURE, FilterAttrs.PRESENT, FilterAttrs.PAST];
  #defaultFilter;
  #defaultItem;
  #TEMPL = '<form class="trip-filters" action="#" method="get"></form>';
  #element;
  reset = () => {
    this.#defaultItem.checked();
    this.#onChangeFilter(this.#defaultFilter);
  };

  constructor(changeFilter) {
    this.#onChangeFilter = changeFilter;
    this.#element = createElement(this.#TEMPL);
    this.#ITEMS.forEach((item) => {
      const elem = new FilterItem(item);
      this.#element.append(elem.getElement());
      if (item.checked) {
        this.#defaultFilter = item.name;
        this.#defaultItem = elem;
      }
    });
    this.#element.addEventListener('change', (evt) => {
      this.#onChangeFilter(evt.target.value);
    });
    this.#element.append(createElement('<button class="visually-hidden" type="submit">Accept filter</button>'));
  }

  getElement = () => this.#element;
}
