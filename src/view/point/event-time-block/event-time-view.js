import AbstractTrickyView from '../../abstract-tricky-view';
import {createElement} from '../../../framework/render';
import DateFrom from './date-from-view';
import DateTo from './date-to-view';
import Duration from './dueation';

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
