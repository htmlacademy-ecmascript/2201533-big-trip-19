import {createElement} from './render.js';
import {DIFF_CLICK, SortAttrs} from '../setings';
import dayjs from 'dayjs';

class SortItemLabel {
  #TEMPL = '<label class="trip-sort__btn"></label>';
  #element;

  constructor(attr, id) {
    this.#element = createElement(this.#TEMPL);
    this.#element.htmlFor = id;
    this.#element.textContent = attr.title;
  }

  getElement = () => this.#element;
}

class SortItemInput {
  #TEMPL = '<input class="trip-sort__input  visually-hidden" type="radio" name="trip-sort">';
  #element;

  constructor(attr, id) {
    this.#element = createElement(this.#TEMPL);
    this.#element.id = id;
    this.#element.value = id;
    this.#element.disabled = attr.disabled;
    this.#element.checked = attr.checked;
  }

  getElement = () => this.#element;
}

class SortItem {
  #CLASS_PREF = 'trip-sort__item--';
  #ID_PREF = 'sort-';
  #TEMPL = '<div class="trip-sort__item"></div>';
  #element;
  #input;

  constructor(item) {
    const id = `${this.#ID_PREF}${item.name}`;
    this.#element = createElement(this.#TEMPL);
    this.#element.classList.add(`${this.#CLASS_PREF}${item.name}`);
    this.#input = new SortItemInput(item, id).getElement();
    this.#element.append(this.#input);
    const label = new SortItemLabel(item, id).getElement();
    this.#element.append(label);
  }

  get input() {
    return this.#input;
  }

  getElement = () => this.#element;
}

export default class Sorting {
  #lastClick = 0;
  #currentField = SortAttrs.DAY;
  #currentOrder = this.#currentField.order;
  #ITEMS = [SortAttrs.DAY, SortAttrs.EVENT, SortAttrs.TIME, SortAttrs.PRICE, SortAttrs.OFFER];
  #TEMPL = '<form class="trip-events__trip-sort  trip-sort" action="#" method="get"></form>';
  #element;
  #onChange;

  constructor() {
    this.#element = createElement(this.#TEMPL);
    this.#ITEMS.forEach((item) => {
      const sortItem = new SortItem(item);
      this.#element.append(sortItem.getElement());
      sortItem.input.addEventListener('click', () => {
        if (dayjs().diff(this.#lastClick) > DIFF_CLICK) {
          this.#lastClick = dayjs();
          this.#currentOrder =
            item === this.#currentField ? this.#currentOrder * -1 : item.order;
          this.#currentField = item;
          this.#onChange(this.#currentField.name, this.#currentOrder);
        }
      });
    });
  }

  set onChange(onChange) {
    this.#onChange = onChange;
  }

  getElement = () => this.#element;
}
