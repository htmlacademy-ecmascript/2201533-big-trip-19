import {createElement} from '../render.js';

class SortItemLabel{
  #TEMPL = '<label class="trip-sort__btn"></label>';
  #element;
  constructor(attr, id) {
    this.#element = createElement(this.#TEMPL);
    this.#element.htmlFor = id;
    this.#element.textContent = attr.title;
  }
  getElement = ()=>this.#element;
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
  getElement = ()=>this.#element;
}

class SortItem{
  #CLASS_PREF = 'trip-sort__item--';
  #ID_PREF = 'sort-';
  #TEMPL = '<div class="trip-sort__item"></div>';
  #element;
  #onClick = (id)=>{console.log(`${id}`)}
  constructor(item) {
    const itemName = item[0];
    const attr = item[1]
    const id = `${this.#ID_PREF}${itemName}`;
    this.#element = createElement(this.#TEMPL);
    this.#element.classList.add(`${this.#CLASS_PREF}${itemName}`);
    const input = new SortItemInput(attr, id).getElement();
    input.addEventListener('click', ()=>this.#onClick(item[0]));
    this.#element.append(input);
    const label = new SortItemLabel(attr, id).getElement();
    this.#element.append(label);
  };
  getElement = ()=>this.#element;
}

export default class Sorting{
  #ITEMS = [
    ['day', {disabled: false, title: 'Day', checked: true}],
    ['event', {disabled: true, title: 'Event', checked: false}],
    ['time', {disabled: false, title: 'Time', checked: false}],
    ['price', {disabled: false, title: 'Price', checked: false}],
    ['offer', {disabled: true, title: 'Offer', checked: false}]
  ];
  #TEMPL = '<form class="trip-events__trip-sort  trip-sort" action="#" method="get"></form>';
  #element;
  constructor() {
    this.#element = createElement(this.#TEMPL);
    this.#ITEMS.forEach(item=>{
      this.#element.append(new SortItem(item).getElement());
    });
  };
  getElement = ()=>this.#element;
}
