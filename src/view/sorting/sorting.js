import {CHANGE_SORT_ORDER, DIFF_CLICK, SortAttrs} from '../../settings';
import dayjs from 'dayjs';
import AbstractTrickyView from '../abstract-tricky-view';
import SortItem from './sort-item';

export default class Sorting extends AbstractTrickyView{
  #lastClick = 0;
  #currentField = SortAttrs.DAY;
  #currentOrder = this.#currentField.order;
  #ITEMS = [SortAttrs.DAY, SortAttrs.EVENT, SortAttrs.TIME, SortAttrs.PRICE, SortAttrs.OFFER];
  #onChange;
  #defaultInput;
  #inputs = [];

  constructor() {
    super();
    this.init();
  }

  init = () => {
    super._createElement();
    this.#ITEMS.forEach((item) => {
      const sortItem = new SortItem(item);
      this.element.append(sortItem.element);
      sortItem.input.element.addEventListener('click', () => {
        if((item === this.#currentField)) {
          if(!CHANGE_SORT_ORDER || (CHANGE_SORT_ORDER && dayjs().diff(this.#lastClick) < DIFF_CLICK)) {
            return;
          }
        }
        this.#lastClick = dayjs();
        this.#currentOrder = item === this.#currentField ? this.#currentOrder * -1 : item.order;
        this.#currentField = item;
        this.#onChange(this.currentMode);
      });
      if (item.checked) {
        this.#defaultInput = sortItem.input;
      }
      this.#inputs.push(sortItem.input);
    });
  };

  reset = () => {
    if (this.#currentField === SortAttrs.DAY) {
      return false;
    }
    this.#currentField = SortAttrs.DAY;
    this.#currentOrder = this.#currentField.order;
    this.#defaultInput.checked = true;
    this.#onChange(this.currentMode);
    return true;
  };

  get currentMode() {
    return {
      field: this.#currentField.field,
      order: this.#currentOrder
    };
  }

  get template() {
    return '<form class="trip-events__trip-sort  trip-sort" action="#" method="get"></form>';
  }

  set onChange(onChange) {
    this.#onChange = onChange;
  }

  set disabled(disabled) {
    this.#ITEMS.forEach((item, index) => {
      this.#inputs[index].disabled = disabled || item.disabled;
    });
  }
}
