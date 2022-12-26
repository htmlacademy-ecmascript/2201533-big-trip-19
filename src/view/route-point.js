import dayjs from 'dayjs';
import {createElement} from '../render';
import {ICONS} from '../setings.js';
import RollupButton from './rollup-btn.js';

class FavouriteButton{
  #TEMPL =
  `<button class="event__favorite-btn" type="button">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path
        d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
    </svg>
  </button>`;
  #element;
  constructor(active) {
    this.#element = createElement(this.#TEMPL);
    if (active){
      this.#element.classList.add('event__favorite-btn--active');
    }
  };
  getElement = ()=>this.#element;
}

// class RollupButton{
//   #TEMPL =
//   `<button class="event__rollup-btn" type="button">
//     <span class="visually-hidden">Open event</span>
//   </button>`;
//   #element;
//   constructor(onClick) {
//     this.#element = createElement(this.#TEMPL);
//     this.#element.addEventListener('click', onClick)
//   };
//   getElement = ()=>this.#element;
// }

class Offer{
  #TEMPL;
  #element;
  constructor(offer) {
    this.#TEMPL =
    `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`;
    this.#element = createElement(this.#TEMPL);
  };
  getElement = ()=>this.#element;
}

class listOffers{
  #TEMPL = '<ul class="event__selected-offers"></ul>';
  #element;
  constructor(offers) {
    this.#element = createElement(this.#TEMPL);
    offers.forEach(offer=>{
      this.#element.append(new Offer(offer).getElement());
    })
  };
  getElement = ()=>this.#element;
}

export default class RoutePoint{
  #TEMPL;
  #element;
  #id;
  #onRollup;
  constructor(id, point, destination, offers, onRollup) {
    this.#id = id;
    this.#onRollup = ()=>{onRollup(this.#id)}
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
    `<div class="event">
      <time class="event__date" dateTime="${point.dateFrom.format('YYYY-MM-DD')}">
        ${point.dateFrom.format('MMM DD').toUpperCase()}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42"
          src="${ICONS.PATH}${point.type}${ICONS.EXT}" alt="Event type icon">
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
    </div>`
    this.#element = createElement(this.#TEMPL);
    if (offers){
      this.#element.append(new listOffers(offers).getElement());
    }
    this.#element.append(new FavouriteButton(point.isFavorite).getElement());
    this.#element.append(new RollupButton(this.#onRollup).getElement());
//    console.log(this.#element);
  };
  getElement = ()=>this.#element;
}
