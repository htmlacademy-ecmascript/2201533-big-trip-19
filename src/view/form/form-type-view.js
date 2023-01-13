import {createElement, createElementSan} from '../render';
import {Icons} from '../../settings';

export default class FormTypeView {
  #onChange;
  #element;
  #iconType;
  #items = {};
  #type;
  #buttonType;
  #fieldSet;
  #input;
  #disabled;

  constructor(types) {
    const typeTitle = (type) => type ? `${type[0].toUpperCase()}${type.slice(1)}` : '';
    this.#element = createElement('<div class="event__type-wrapper"></div>');
    this.#input = createElement(
      '<input class="event__type-toggle  visually-hidden" id="event-type-toggle" type="checkbox">');
    this.#element.append(this.#input);
    this.#buttonType = createElement(
      `<label class="event__type  event__type-btn" for="event-type-toggle">
        <span class="visually-hidden">Choose event type</span>
      </label>
    `);
    this.#iconType = createElementSan(`<img class="event__type-icon" width="17" height="17"
      src="${Icons.DEFAULT}" alt="Event type icon">`);
    this.#buttonType.append(this.#iconType);
    const listTypes = createElement('<div class="event__type-list"></div>');
    this.#fieldSet = createElement(
      `<fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
      </fieldset>`);
    types.forEach((type) => {
      this.#items[type] = createElementSan(
        `<input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio"
              name="event-type" value="${type}">`);

      const container = createElementSan(
        `<div class="event__type-item">
          <label class="event__type-label  event__type-label--${type}" for="event-type-${type}">${typeTitle(type)}</label>
        </div>`
      );
      container.prepend(this.#items[type]);
      this.#fieldSet.append(container);
    });

    this.#fieldSet.addEventListener('change', (evt) => {
      this.#type = evt.target.value;
      listTypes.style.display = 'none';
      this.#iconType.src = `${Icons.PATH}${this.#type}${Icons.EXT}`;
      this.#onChange(this.#type);
    });

    this.#buttonType.addEventListener('click', () => {
      if (this.#disabled) {
        return;
      }
      const states = {
        block: 'none',
        none: 'block',
        '': 'block'
      };
      listTypes.style.display = states[listTypes.style.display];
    });

    listTypes.append(this.#fieldSet);
    this.#element.append(this.#buttonType);
    this.#element.append(listTypes);
  }

  default() {
    if (this.#type) {
      this.#items[this.#type].checked = false;
      this.#iconType.src = Icons.DEFAULT;
      this.#type = '';
    }
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

  set onChange(onChange) {
    this.#onChange = onChange;
  }

  getElement = () => this.#element;
}
