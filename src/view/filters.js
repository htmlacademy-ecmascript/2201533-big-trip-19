import {createElement} from '../render';

class FilterItemLabel{
  #TEMPL = '<label class="trip-filters__filter-label">Future</label>';
  #element;
  constructor(attr, id) {
    this.#element = createElement(this.#TEMPL);
    this.#element.htmlFor = id;
    this.#element.textContent = attr.title;
  }
  getElement = ()=>this.#element;
}

class FilterItemInput{
  #TEMPL = '<input class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter">';
  #element;
  constructor(attr, id) {
    this.#element = createElement(this.#TEMPL);
    this.#element.id = id;
    this.#element.value = attr.value;
    this.#element.checked = attr.checked;
  }
  getElement = ()=>this.#element;
}

class FilterItem{
  #ID_PREF = 'filter-';
  #TEMPL = '<div class="trip-filters__filter"></div>';
  #element;
  constructor(item) {
    console.log(item);
    this.#element = createElement(this.#TEMPL);
    const id = `${this.#ID_PREF}${item.name}`;
    this.#element = createElement(this.#TEMPL);
    const input = new FilterItemInput(item, id).getElement();
    this.#element.append(input);
    const label = new FilterItemLabel(item, id).getElement();
    this.#element.append(label);
  }
  getElement = ()=>this.#element;
}

export default class Filters{
  #ITEMS = [
    {name: 'everything', title:'Everything', checked: true},
    {name: 'future', title:'Future', checked: false},
    {name: 'present', title:'Present', checked: false},
    {name: 'past', title:'Past', checked: false}
  ];
  #TEMPL = '<form class="trip-filters" action="#" method="get"></form>';
  #element;
  constructor() {
    this.#element = createElement(this.#TEMPL);
    this.#ITEMS.forEach(item=>{
      this.#element.append(new FilterItem(item).getElement());
    });
    this.#element.append(createElement('<button class="visually-hidden" type="submit">Accept filter</button>'))
  };
  getElement = ()=>this.#element;
}
