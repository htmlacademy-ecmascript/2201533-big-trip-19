import AbstractView from '../../framework/view/abstract-view';
import AbstractTrickyView from '../abstract-tricky-view';

class FilterItemLabel extends AbstractView {
  constructor(attr, id) {
    super();
    this.element.htmlFor = id;
    this.element.textContent = attr.title;
  }

  get template() {
    return '<label class="trip-filters__filter-label">Future</label>';
  }
}

class FilterItemInput extends AbstractView {
  constructor(attr, id) {
    super();
    this.element.id = id;
    this.element.value = attr.name;
    this.element.checked = attr.checked;
  }

  get template() {
    return '<input class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter">';
  }
}

export default class FilterItem extends AbstractTrickyView {
  #ID_PREF = 'filter-';
  #input;

  constructor(item) {
    super();
    const id = `${this.#ID_PREF}${item.name}`;
    this.#input = new FilterItemInput(item, id);
    const label = new FilterItemLabel(item, id);
    this._createElement(label);
  }

  _createElement(label) {
    super._createElement();
    this.element.append(this.#input.element);
    this.element.append(label.element);
  }

  get input() {
    return this.#input;
  }

  set checked (check) {
    this.#input.checked = check;
  }

  get template() {
    return '<div class="trip-filters__filter"></div>';
  }
}
