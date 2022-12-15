import dayjs from 'dayjs';
import {createElement} from '../render';
const ICONS_PATH = 'img/icons/';
const ICONS_EXT = '.png';

class Offer{
  #TEMPL;
  #element;
  constructor(offer) {
    this.#element = createElement(this.#TEMPL);
    offer.forEach(offer=>{
      this.#element.append()
    })
  }
  getElement = ()=>this.#element;
}

class listOffers{
  #TEMPL = '<ul class="event__selected-offers"></ul>';
  #element;
  constructor(offers) {
    this.#element = createElement(this.#TEMPL);
    offers.forEach(offer=>{
      this.#element.append(offer)
    })
  }
  getElement = ()=>this.#element;
}

export default class RoutePoint{
  #TEMPL;
  #element;
  constructor(point, destination) {
    const duration = ()=>{
      let m = Math.floor(dayjs.duration(point.dateTo.diff(point.dateFrom)).asMinutes());
      const d = Math.floor(m/60/24);
      m -= d * 24 * 60;
      const h = Math.floor(m/60);
      m -= h * 60;
      return (d > 0 ? `${d}D `: '') +
        (h > 0 ? `${h.toString(10).padStart(2, '0')}H ` : '') +
        `${m.toString().padStart(2, '0')}M`;
    };
    this.#TEMPL =
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" dateTime="${point.dateFrom.format('YYYY-MM-DD')}">
          ${point.dateFrom.format('MMM DD').toUpperCase()}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42"
            src="${ICONS_PATH}${point.type}${ICONS_EXT}" alt="Event type icon">
        </div>
        <h3 class="event__title">${point.type[0].toUpperCase()}${point.type.slice(1)} ${destination}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" dateTime="${point.dateFrom.format('YYYY-MM-DD[T]HH:mm')}">
              ${point.dateFrom.format('HH:mm')}</time>
            &mdash;
            <time class="event__end-time" dateTime="${point.dateTo.format('YYYY-MM-DD[T]HH:mm')}">
              ${point.dateTo.format('HH:mm')}</time>
          </p>
          <p class="event__duration">${duration()}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
        </p>
      </div>
    </li>`
    this.#element = createElement(this.#TEMPL);
    if (point.offers.length > 0){
      this.#element.append(new listOffers(point.offers).getElement());
    }
  };
  getElement = ()=>this.#element;
}

const tmp =`
<li class="trip-events__item">
  <div class="event">
    <time class="event__date" dateTime="2019-03-18">MAR 18</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon">
    </div>
    <h3 class="event__title">Taxi Amsterdam</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" dateTime="2019-03-18T10:30">10:30</time>
        &mdash;
        <time class="event__end-time" dateTime="2019-03-18T11:00">11:00</time>
      </p>
      <p class="event__duration">30M</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">20</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      <li class="event__offer">
        <span class="event__offer-title">Order Uber</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">20</span>
      </li>
    </ul>
    <button class="event__favorite-btn event__favorite-btn--active" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path
          d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>
`;
