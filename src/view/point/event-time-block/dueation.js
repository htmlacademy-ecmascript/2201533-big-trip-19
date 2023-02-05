import AbstractView from '../../../framework/view/abstract-view';
import dayjs from 'dayjs';

export default class Duration extends AbstractView {
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
