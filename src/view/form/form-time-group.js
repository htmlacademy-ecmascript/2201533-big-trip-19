import {createElement, createElementSan} from '../render';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';

export default class FormTimeGroup {
  #element;
  #inputs = {};
  #onChange;

  constructor() {
    this.#element = createElement('<div class="event__field-group  event__field-group--time"></div>');
    const fields = [
      {
        name: 'start',
        title: 'From',
        field: 'dateFrom',
        tail: '—'
      },
      {
        name: 'end',
        title: 'To',
        field: 'dateTo',
        tail: ''
      }
    ];

    const getLabel = (title) => createElementSan(
      `<label class="visually-hidden" for="event-start-time">${title}</label>`);
    const getInput = (name, field) => {
      const input = createElementSan(
        `<input class="event__input  event__input--time" id="event-${name}-time" type="text"
        name="event-${name}-time" value="${dayjs().format('DD/MM/YY HH:mm')}">`
      );
      flatpickr(input, {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
      });
      input.addEventListener('change', (evt) => {
        this.#onChange(field, dayjs(evt.target.value, 'DD/MM/YY HH:mm'));
      });
      this.#inputs[field] = input;
      return input;
    };
    fields.forEach((field) => {
      this.#element.append(getLabel(field.title));
      this.#element.append(getInput(field.name, field.field));
      this.#element.append(field.tail);
    });
  }

  set dateFrom(date) {
    this.#inputs.dateFrom.value = date.format('DD/MM/YY HH:mm');
  }

  set dateTo(date) {
    this.#inputs.dateTo.value = date.format('DD/MM/YY HH:mm');
  }

  set onChange(onChange) {
    this.#onChange = onChange;
  }

  default() {
    this.dateFrom = dayjs();
    this.dateTo = dayjs();
  }

  getElement = () => this.#element;
}
