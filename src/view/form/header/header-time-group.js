import {createElement} from '../../../framework/render';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';
import DOMPurify from 'dompurify';
import AbstractTrickyView from '../../abstract-tricky-view';

export default class HeaderTimeGroup extends AbstractTrickyView {
  #inputs = {};
  onChange;
  #fields = [
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

  constructor() {
    super();
    this._createElement();
  }

  _createElement = () => {
    super._createElement();
    this.#fields.forEach((field) => {
      this.element.append(this.#createLabel(field.title));
      this.element.append(this.#createInput(field.name, field.field));
      this.element.append(field.tail);
    });
  };

  #createLabel = (title) => createElement(DOMPurify.sanitize(
    `<label class="visually-hidden" for="event-start-time">${title}</label>`
  ));

  #createInput = (name, field) => {
    const input = createElement(DOMPurify.sanitize(
      `<input class="event__input  event__input--time" id="event-${name}-time" type="text"
            name="event-${name}-time" value="${dayjs().format('DD/MM/YY HH:mm')}">`
    ));
    this.#inputs[`${name}Pkr`] = flatpickr(input, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
    });
    input.addEventListener('change', (evt) => {
      this.onChange(field, dayjs(evt.target.value, 'DD/MM/YY HH:mm'));
    });
    this.#inputs[field] = input;
    return input;
  };

  default() {
    this.dateFrom = dayjs();
    this.dateTo = dayjs();
  }

  set dateFrom(date) {
    this.#inputs.dateFrom.value = date.format('DD/MM/YY HH:mm');
  }

  set dateTo(date) {
    this.#inputs.dateTo.value = date.format('DD/MM/YY HH:mm');
  }

  set disabled(disabled) {
    Object.values(this.#inputs).forEach((input) => {input.disabled = disabled;});
  }

  get template() {
    return '<div class="event__field-group  event__field-group--time"></div>';
  }
}
