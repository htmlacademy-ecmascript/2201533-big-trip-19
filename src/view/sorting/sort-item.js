import AbstractView from '../../framework/view/abstract-view';
import AbstractTrickyView from '../abstract-tricky-view';

class SortItemLabel extends AbstractView{
  constructor(attr, id) {
    super();
    this.element.htmlFor = id;
    this.element.textContent = attr.title;
  }

  get template() {
    return '<label class="trip-sort__btn"></label>';
  }
}

class SortItemInput extends AbstractView{
  constructor(attr, id) {
    super();
    this.element.id = id;
    this.element.value = id;
    this.element.disabled = attr.disabled;
    this.element.checked = attr.checked;
  }

  get template() {
    return '<input class="trip-sort__input  visually-hidden" type="radio" name="trip-sort">';
  }
}

export default class SortItem extends AbstractTrickyView{
  #CLASS_PREF = 'trip-sort__item--';
  #ID_PREF = 'sort-';
  #input;

  constructor(item) {
    super();
    const id = `${this.#ID_PREF}${item.name}`;
    this.#input = new SortItemInput(item, id);
    const label = new SortItemLabel(item, id);
    this.init(label, item.name);
  }

  init = (label, name) => {
    super._createElement();
    this.element.classList.add(`${this.#CLASS_PREF}${name}`);
    this.element.append(this.#input.element);
    this.element.append(label.element);
  };

  get input() {
    return this.#input;
  }

  get template() {
    return '<div class="trip-sort__item"></div>';
  }
}
