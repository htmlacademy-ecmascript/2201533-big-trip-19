import AbstractView from '../../framework/view/abstract-view';

export default class extends AbstractView {
  #currentChild;

  get template() {
    return '<li class="trip-events__item"></li>';
  }

  append = (routePoint) => {
    this.#currentChild = routePoint.element;
    this.element.append(this.#currentChild);
  };

  replace = (newChild) => {
    this.#currentChild.replaceWith(newChild.element);
    this.#currentChild = newChild.element;
  };
}
