import {createElement} from '../render.js';
import {DEFAULT_ORDERS} from '../setings';

class SortItemLabel{
  #TEMPL = '<label class="trip-sort__btn"></label>';
  #element;
  constructor(attr, id) {
    this.#element = createElement(this.#TEMPL);
    this.#element.htmlFor = id;
    this.#element.textContent = attr.title;
  }
  getElement = () => this.#element;
}

class SortItemInput{
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

class SortItem{
  #CLASS_PREF = 'trip-sort__item--';
  #ID_PREF = 'sort-';
  #TEMPL = '<div class="trip-sort__item"></div>';
  #element;
  #input;
  constructor(item) {
    const itemName = item[0];
    const attr = item[1]
    const id = `${this.#ID_PREF}${itemName}`;
    this.#element = createElement(this.#TEMPL);
    this.#element.classList.add(`${this.#CLASS_PREF}${itemName}`);
    this.#input = new SortItemInput(attr, id).getElement();
    this.#element.append(this.#input);
    const label = new SortItemLabel(attr, id).getElement();
    this.#element.append(label);
  };

  get input(){
    return this.#input;
  };

  getElement = ()=>this.#element;
}

export default class Sorting{
  #currentField = 'day';
  #currentOrder = DEFAULT_ORDERS.day;
  #ITEMS = [
    ['day', {title: 'Day', disabled: false, checked: true}],
    ['event', {title: 'Event', disabled: true, }],
    ['time', {title: 'Time', disabled: false, }],
    ['price', {title: 'Price', disabled: false, }],
    ['offer', {title: 'Offer', disabled: true, }]
  ];
  #TEMPL = '<form class="trip-events__trip-sort  trip-sort" action="#" method="get"></form>';
  #element;
  #onChange;

  constructor() {
    this.#element = createElement(this.#TEMPL);
    this.#ITEMS.forEach(item => {
      const sortItem = new SortItem(item);
      this.#element.append(sortItem.getElement());
      sortItem.input.addEventListener('click', () => {
        this.#currentOrder =
          item[0] === this.#currentField ? this.#currentOrder * -1 : DEFAULT_ORDERS[item[0]];
        this.#currentField = item[0];
        this.#onChange(this.#currentField, this.#currentOrder);
      });
    });
  };

  set onChange(onChange){
    this.#onChange = onChange;
  };

  getElement = () => this.#element;
}
