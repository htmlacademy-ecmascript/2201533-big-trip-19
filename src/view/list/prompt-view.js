import AbstractView from '../../framework/view/abstract-view';

export default class PromptView extends AbstractView {

  get template() {
    return '<p class="trip-events__msg"></p>';
  }
}
