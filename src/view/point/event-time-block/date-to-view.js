import AbstractView from '../../../framework/view/abstract-view';

export default class DateTo extends AbstractView {
  get template() {
    return '<time class="event__end-time" dateTime=""></time>';
  }

  set date(date) {
    this.element.dateTime = date.format('YYYY-MM-DD[T]HH:mm');
    this.element.textContent = date.format('HH:mm').toUpperCase();
  }
}
