import AbstractView from '../../../framework/view/abstract-view';

export default class TypeIcon extends AbstractView {
  get template() {
    return '<img class="event__type-icon" width="42" height="42" src="#" alt="Event type icon">';
  }
}
