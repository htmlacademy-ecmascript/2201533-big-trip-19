import AbstractView from '../../framework/view/abstract-view';
import dayjs from 'dayjs';
import AbstractTrickyView from '../abstract-tricky-view';
import {createElement} from '../../framework/render';

class DateFrom extends AbstractView {
  get template() {
    return '<time class="event__start-time" dateTime=""></time>';
  }

  set date(date) {
    this.element.dateTime = date.format('YYYY-MM-DD[T]HH:mm');
    this.element.textContent = date.format('HH:mm').toUpperCase();
  }
}

class DateTo extends AbstractView {
  get template() {
    return '<time class="event__end-time" dateTime=""></time>';
  }

  set date(date) {
    this.element.dateTime = date.format('YYYY-MM-DD[T]HH:mm');
    this.element.textContent = date.format('HH:mm').toUpperCase();
  }
}

class Duration extends AbstractView {
  #getDuration = (start, end) => {
    const duration = Math.floor(dayjs.duration(end.diff(start)).asMinutes());
    if (duration === 0) {
      return '0M';
    }
    let m = Math.abs(duration);
    const sign = duration / m === 1 ? '' : '-';

    const d = Math.floor(m / 60 / 24);
    m -= d * 24 * 60;
    const h = Math.floor(m / 60);
    m -= h * 60;
    return `${sign} ${(d > 0 ? `${d}D ` : '') +
      (h > 0 ? `${h.toString(10).padStart(2, '0')}H ` : '')
    }${m.toString().padStart(2, '0')}M`;
  };

  get template() {
    return '<p class="event__duration"></p>';
  }

  set duration(dates) {
    this.element.textContent = this.#getDuration(dates.start, dates.end);
  }
}

export default class BlockTime extends AbstractTrickyView {
  #start;
  #end;
  #duration;

  constructor() {
    super();
    this.#start = new DateFrom();
    this.#end = new DateTo();
    this.#duration = new Duration();
    this.init();
  }

  init = () => {
    super._createElement();
    const container = createElement('<p class="event__time">&mdash;</p>');
    container.append(this.#end.element);
    container.prepend(this.#start.element);
    this.element.append(container);
    this.element.append(this.#duration.element);
  };

  get template() {
    return '<div class="event__schedule"></div>';
  }

  set start(date) {
    this.#start.date = date;
  }

  set end(date) {
    this.#end.date = date;
  }

  set duration(dates) {
    this.#duration.duration = dates;
  }
}
