import AbstractView from '../../framework/view/abstract-view';

export default class EventDate extends AbstractView {
  get template() {
    return '<time class="event__date" dateTime=""></time>';
  }

  set date(date) {
    this.element.dateTime = date.format('YYYY-MM-DD');
    this.element.textContent = date.format('MMM DD').toUpperCase();
  }
}
