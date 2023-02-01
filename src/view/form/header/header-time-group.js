import {createElement} from '../../../framework/render';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';
import DOMPurify from 'dompurify';
import AbstractTrickyView from '../../abstract-tricky-view';
import {MIN_DURATION} from '../../../settings';


export default class HeaderTimeGroup extends AbstractTrickyView {
  #inputs = {};
  onChange;
  #format = 'DD/MM/YY HH:mm';
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

  #constraint = (index) => {
    switch (index) {
      case 0 :
        this.#inputs.startPkr.config.maxDate =
          (dayjs(this.#inputs.dateTo.value, this.#format).subtract(dayjs.duration(MIN_DURATION))).format(this.#format);
        break;
      case 1 :
        this.#inputs.endPkr.config.minDate =
          (dayjs(this.#inputs.dateFrom.value, this.#format).add(dayjs.duration(MIN_DURATION))).format(this.#format);
        break;
    }
  };

  constructor() {
    super();
    this._createElement();
  }

  _createElement = () => {
    super._createElement();
    this.#fields.forEach((field,index) => {
      this.element.append(this.#createLabel(field.title));
      this.element.append(this.#createInput(index));
      this.element.append(field.tail);
    });
  };

  #createLabel = (title) => createElement(DOMPurify.sanitize(
    `<label class="visually-hidden" for="event-start-time">${title}</label>`
  ));

  #createInput = (index) => {
    const name = this.#fields[index].name;
    const field = this.#fields[index].field;
    const input = createElement(DOMPurify.sanitize(
      `<input class="event__input  event__input--time" id="event-${name}-time" type="text"
            name="event-${name}-time" value="">`
    ));
    this.#inputs[`${name}Pkr`] = flatpickr(input, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      onOpen : (selectedDates, dateStr, instance) => {
        instance.setDate(input.value);
        this.#constraint(index);
      }
    });
    input.addEventListener('change', (evt) => {
      this.onChange(field, dayjs(evt.target.value, this.#format));
    });
    this.#inputs[field] = input;
    return input;
  };

  default() {
    const currentDate = dayjs();
    this.dateFrom = currentDate;
    this.dateTo = currentDate.add(dayjs.duration(MIN_DURATION));
  }

  set dateFrom(date) {
    this.#inputs.dateFrom.value = date.format(this.#format);
  }

  set dateTo(date) {
    this.#inputs.dateTo.value = date.format(this.#format);
  }

  set disabled(disabled) {
    Object.values(this.#inputs).forEach((input) => {input.disabled = disabled;});
  }

  get template() {
    return '<div class="event__field-group  event__field-group--time"></div>';
  }
}
