import dayjs from 'dayjs';
import {createElement, createElementSan, RenderPosition} from '../render';
import {Icons} from '../../settings.js';
import RollupButton from './rollup-btn.js';
import FavoriteButton from './favorite-button';
import ListOffers from './list-offers';

export default class RoutePoint {
  #TEMPLATE;
  #element;
  #id;
  #eventDate;
  #typeIcon;
  #eventTitle;
  #dateFrom;
  #dateTo;
  #durationElement;
  #price;
  #offers;
  #favoriteButton;
  #rollupButton;

  constructor(point, destination, offers) {
    this.#id = point.id;
    this.#eventDate = createElementSan(
      `<time class="event__date" dateTime="${point.dateFrom.format('YYYY-MM-DD')}">
          ${point.dateFrom.format('MMM DD').toUpperCase()}</time>`);
    this.#typeIcon = createElementSan(`<img class="event__type-icon" width="42" height="42"
          src="${Icons.PATH}${point.type}${Icons.EXT}" alt="Event type icon">`);
    this.#eventTitle = createElementSan(
      `<h3 class="event__title">${point.type[0].toUpperCase()}${point.type.slice(1)} ${destination}</h3>`
    );
    this.#dateFrom = createElementSan(
      `<time class="event__start-time" dateTime="${point.dateFrom.format('YYYY-MM-DD[T]HH:mm')}">
            ${point.dateFrom.format('HH:mm')}</time>`);
    this.#dateTo = createElementSan(
      `<time class="event__end-time" dateTime=
            "${point.dateTo.format('YYYY-MM-DD[T]HH:mm')}">${point.dateTo.format('HH:mm')}</time>`
    );
    this.#durationElement = createElementSan(
      `<p class="event__duration">${this.#duration(point.dateFrom, point.dateTo)}</p>`);
    this.#price = createElement(`<span class="event__price-value">${point.basePrice}</span>`);

    this.#TEMPLATE = '<div class="event"></div>';
    this.#element = createElement(this.#TEMPLATE);
    this.#element.append(this.#eventDate);
    this.#element.append(
      (() => {
        const container = createElement(
          '<div class="event__type"></div>');
        container.append(this.#typeIcon);
        return container;
      })()
    );
    this.#element.append(this.#eventTitle);
    this.#element.append(
      (() => {
        const div = createElement(
          '<div class="event__schedule"></div>');
        div.append(
          (() => {
            const container = createElement(
              '<p class="event__time">&mdash;</p>');
            container.append(this.#dateTo);
            container.prepend(this.#dateFrom);
            return container;
          })());
        div.append(this.#durationElement);
        return div;
      })()
    );
    this.#element.append(
      (() => {
        const container = createElement(
          '<p class="event__price">&euro;&nbsp;</p>');
        container.append(this.#price);
        return container;
      })()
    );

    if (offers) {
      this.#offers = new ListOffers(offers).getElement();
      this.#element.append(this.#offers);
    } else {
      this.#offers = false;
    }
    this.#favoriteButton = new FavoriteButton(point.isFavorite);
    this.#element.append(this.#favoriteButton.getElement());
    this.#rollupButton = new RollupButton().getElement();
    this.#element.append(this.#rollupButton);
  }

  update(point, alter, destination, offers) {
    const change = {
      basePrice: () => {
        this.#price.textContent = point.basePrice;
      },
      dateFrom: () => {
        this.#eventDate.dateTime = point.dateFrom.format('YYYY-MM-DD');
        this.#eventDate.textContent = point.dateFrom.format('MMM DD').toUpperCase();
        this.#dateFrom.dateTime = point.dateFrom.format('YYYY-MM-DD[T]HH:mm');
        this.#dateFrom.textContent = point.dateFrom.format('HH:mm');
      },
      dateTo: () => {
        this.#dateTo.dateTime = point.dateTo.format('YYYY-MM-DD[T]HH:mm');
        this.#dateTo.textContent = point.dateTo.format('HH:mm');
      },
      destination: () => {
      },
      isFavorite: () => {
      },
      offers: () => {
        if (this.#offers) {
          this.#offers.remove();
        }
        if (offers) {
          this.#offers = new ListOffers(offers).getElement();
          this.#favoriteButton.getElement().insertAdjacentElement(RenderPosition.BEFOREBEGIN, this.#offers);
        } else {
          this.#offers = false;
        }
      },
      type: () => {
        this.#typeIcon.src = `${Icons.PATH}${point.type}${Icons.EXT}`;
      },
      duration: () => {
        this.#durationElement.textContent = this.#duration(point.dateFrom, point.dateTo);
      },
      title: () => {
        this.#eventTitle.textContent = `${point.type[0].toUpperCase()}${point.type.slice(1)} ${destination}`;
      }
    };
    alter.forEach((field) => change[field]());
  }

  getElement = () => this.#element;

  get favoriteButton() {
    return this.#favoriteButton;
  }

  get rollupButton() {
    return this.#rollupButton;
  }

  get header() {
    return this.#element;
  }

  #duration = (dateFrom, dateTo) => {
    let m = Math.floor(dayjs.duration(dateTo.diff(dateFrom)).asMinutes());
    const d = Math.floor(m / 60 / 24);
    m -= d * 24 * 60;
    const h = Math.floor(m / 60);
    m -= h * 60;
    return `${(d > 0 ? `${d}D ` : '') +
      (h > 0 ? `${h.toString(10).padStart(2, '0')}H ` : '')
    }${m.toString().padStart(2, '0')}M`;
  };
}
