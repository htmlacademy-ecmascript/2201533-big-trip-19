import {createElement} from '../../../framework/render';
import {Icons} from '../../../settings';
import DOMPurify from 'dompurify';
import AbstractTrickyView from '../../abstract-tricky-view';

export default class HeaderTypeView extends AbstractTrickyView {
  #iconType;
  #items = {};
  #type;
  #buttonType;
  #fieldSet;
  #input;
  #disabled = false;
  #typeTitle = (type) => type ? `${type[0].toUpperCase()}${type.slice(1)}` : '';
  onChange;

  constructor(types) {
    super();
    this.init(types);
  }

  init = (types) => {
    super._createElement();
    this.#input = createElement(
      '<input class="event__type-toggle  visually-hidden" id="event-type-toggle" type="checkbox">');
    this.#buttonType = createElement(
      `<label class="event__type  event__type-btn" for="event-type-toggle">
        <span class="visually-hidden">Choose event type</span>
      </label>
    `);
    this.#iconType = createElement(`<img class="event__type-icon" width="17" height="17"
      src="${Icons.DEFAULT}" alt="Event type icon">`);
    this.#buttonType.append(this.#iconType);
    const listTypes = createElement('<div class="event__type-list"></div>');
    this.#fieldSet = createElement(
      `<fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
      </fieldset>`);
    types.forEach((type) => {
      this.#items[type] = createElement(DOMPurify.sanitize(
        `<input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio"
              name="event-type" value="${type}">`));
      const container = createElement(
        DOMPurify.sanitize(
          `<div class="event__type-item">
          <label class="event__type-label  event__type-label--${type}" for="event-type-${type}">${this.#typeTitle(type)}</label>
          </div>`
        )
      );
      container.prepend(this.#items[type]);
      this.#fieldSet.append(container);
    });

    this.#fieldSet.addEventListener('change', (evt) => {
      this.#type = evt.target.value;
      listTypes.style.display = 'none';
      this.#iconType.src = `${Icons.PATH}${this.#type}${Icons.EXT}`;
      this.onChange(this.#type);
    });

    this.#buttonType.addEventListener('click', () => {
      if (this.#disabled) {
        return;
      }
      const States = {
        BLOCK: 'none',
        NONE: 'block',
        '': 'block'
      };
      listTypes.style.display = States[listTypes.style.display.toUpperCase()];
    });

    listTypes.append(this.#fieldSet);
    this.element.append(this.#input);
    this.element.append(this.#buttonType);
    this.element.append(listTypes);
  };

  get template() {
    return '<div class="event__type-wrapper"></div>';
  }

  set type(type) {
    this.#type = type;
    this.#iconType.src = `${Icons.PATH}${type}${Icons.EXT}`;
    this.#items[type].checked = true;
  }

  set disabled(disabled) {
    this.#disabled = disabled;
    this.#input.disabled = disabled;
    this.#fieldSet.disabled = disabled;
  }

  setDefault = () => {
    if (this.#type) {
      this.#items[this.#type].checked = false;
      this.#iconType.src = Icons.DEFAULT;
      this.#type = '';
    }
  }
}
