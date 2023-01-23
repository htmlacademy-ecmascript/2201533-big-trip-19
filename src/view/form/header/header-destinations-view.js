import {createElement} from '../../../framework/render';
import AbstractTrickyView from '../../abstract-tricky-view';
import DOMPurify from 'dompurify';

export default class HeaderDestinationsView extends AbstractTrickyView{
  #labelType;
  onChange;
  #destination;
  #inputDestination;
  #destinations;

  constructor(destinations) {
    super();
    this.#destinations = destinations;
    this._createElement();
  }

  _createElement() {
    super._createElement();
    this.#labelType = createElement(
      '<label class="event__label  event__type-output" for="event-destination"></label>');

    this.#inputDestination = createElement(
      `<input class="event__input  event__input--destination" id="event-destination" type="text"
        name="event-destination" value="" list="destination-list">
    `);
    this.#inputDestination.addEventListener('change', (evt) => {
      const destination = this.#destinations.find((element) => element.name === evt.target.value);
      if (destination) {
        this.onChange(destination);
      }
    });
    this.element.prepend(this.#inputDestination);
    this.element.prepend(this.#labelType);
  }

  default() {
    this.name = '';
    this.#labelType.textContent = '';
  }

  get destination() {
    return this.#destination;
  }

  get labelType() {
    return this.#labelType;
  }

  set name(name) {
    this.#inputDestination.value = name;
  }

  set disabled(disabled) {
    this.#inputDestination.disabled = disabled;
  }

  set type(type) {
    this.#labelType.textContent = `${type[0].toUpperCase()}${type.slice(1)}`;
  }

  get template() {
    return DOMPurify.sanitize(
      `<div class="event__field-group  event__field-group--destination">
        <datalist id="destination-list">
          ${Array.from(this.#destinations, (elem) => `<option value="${elem.name}"></option>`).join('')}
        </datalist>
      </div>`
    );
  }
}
