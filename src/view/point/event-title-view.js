import AbstractView from '../../framework/view/abstract-view';

export default class EventTitle extends AbstractView {
  get template() {
    return '<h3 class="event__title"></h3>';
  }

  set title(params) {
    this.element.textContent = `${params.type[0].toUpperCase()}${params.type.slice(1)} ${params.destination}`;
  }
}
