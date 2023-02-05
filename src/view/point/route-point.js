import {RenderPosition} from '../../framework/render';
import RollupButton from './rollup-btn.js';
import FavoriteButton from './favorite-button';
import ListOffers from './list-offers';
import AbstractTrickyView from '../abstract-tricky-view';
import EventDate from './event-date-view';
import TypeBlock from './event-type-view';
import EventTitle from './event-title-view';
import BlockTime from './event-time-view';
import PriceBlock from './event-price-view';
import {VIEW_EVENT_PRICE} from '../../settings';

export default class RoutePoint extends AbstractTrickyView{
  #eventDate;
  #typeBlock;
  #timeBlock;
  #eventTitle;
  #price;
  #offers;
  #favoriteButton;
  #rollupButton;

  constructor(point, destination, offers, onRollUp, onChangeFavorite) {
    super();
    this.#eventDate = new EventDate();
    this.#typeBlock = new TypeBlock();
    this.#eventTitle = new EventTitle();
    this.#timeBlock = new BlockTime();
    this.#price = new PriceBlock();
    this.#offers = offers ? new ListOffers(offers) : false;
    this.#favoriteButton = new FavoriteButton(point.isFavorite, onChangeFavorite);
    this.#rollupButton = new RollupButton(onRollUp);
    this._createElement();
    this.init(point, destination);
  }

  init = (point, destination) => {
    super._createElement();
    this.element.append(this.#eventDate.element);
    this.element.append(this.#typeBlock.element);
    this.element.append(this.#eventTitle.element);
    this.element.append(this.#timeBlock.element);
    this.element.append(this.#price.element);
    if (this.#offers) {
      this.element.append(this.#offers.element);
    }
    this.element.append(this.#favoriteButton.element);
    this.element.append(this.#rollupButton.element);
    this.#eventDate.date = point.dateFrom;
    this.#typeBlock.type = point.type;
    this.#eventTitle.title = {type: point.type, destination: destination};
    this.#timeBlock.start = point.dateFrom;
    this.#timeBlock.end = point.dateTo;
    this.#timeBlock.duration = {start: point.dateFrom, end: point.dateTo};
    this.#price.price = point[VIEW_EVENT_PRICE];
  };

  update = (point, changes, destination, offers) => {
    const change = {
      basePrice: () => {
        this.#price.price = point[VIEW_EVENT_PRICE];
      },
      dateFrom: () => {
        this.#eventDate.date = point.dateFrom;
        this.#timeBlock.start = point.dateFrom;
      },
      dateTo: () => {
        this.#timeBlock.end = point.dateTo;
      },
      offers: () => {
        if (this.#offers) {
          this.#offers.element.remove();
        }
        if (offers) {
          this.#offers = new ListOffers(offers);
          this.#favoriteButton.element.insertAdjacentElement(RenderPosition.BEFOREBEGIN, this.#offers.element);
        } else {
          this.#offers = false;
        }
        this.#price.price = point[VIEW_EVENT_PRICE];
      },
      type: () => {
        this.#typeBlock.type = point.type;
      },
      duration: () => {
        this.#timeBlock.duration = {start: point.dateFrom, end: point.dateTo};
      },
      title: () => {
        this.#eventTitle.title = {type: point.type, destination: destination};
      }
    };
    changes.forEach((field) => change[field]());
  };

  get favoriteButton() {
    return this.#favoriteButton;
  }

  get template() {
    return '<div class="event"></div>';
  }

  set disabled(disabled) {
    this.#rollupButton.disabled = disabled;
  }
}
