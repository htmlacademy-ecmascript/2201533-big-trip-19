import {createElement} from '../render.js';
import FormOffersView from './form-offers-view';
import FormDestinationView from './form-destination-view';
import FormHeaderView from './form-header-view';

export default class EditFormView {
  #point;
  #destinations;
  #TEMPLATE = `<form class="event event--edit" action="#" method="post">
              <section class="event__details"></section>
            </form>`;

  #element;
  #header;
  #details;
  #offers;
  #sectionOffers;
  #sectionDestination;
  owner;

  constructor(types, destinations, offers) {
    this.#destinations = destinations;
    this.#offers = offers;
    this.#header = new FormHeaderView(types, destinations);
    this.#header.onChangeType = (type) => {
      this.#point.type = type;
      this.#point.offers = [];
      if (this.#sectionOffers) {
        this.#sectionOffers.remove();
      }
      this.#setSectionOffers();
      if (this.#sectionOffers) {
        this.#details.prepend(this.#sectionOffers.getElement());
      }
    };
    this.#header.onChangeDestination = (destination) => {
      this.#point.destination = destination.id;
      if (this.#sectionDestination) {
        this.#sectionDestination.remove();
      }
      this.#setSectionDestination(destination);
    };
    this.header.onChangeDate = (key, value) => {
      this.#point[key] = value;
    };
    this.header.onChangePrice = (price) => {
      this.#point.basePrice = price;
    };
    this.#element = createElement(this.#TEMPLATE);
    this.#details = this.#element.querySelector('.event__details');
    this.#element.prepend(this.#header.getElement());
    this.#element.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.owner.submit();
    });
    this.buttonCancel.addEventListener('click', () => {
      this.owner.cancel();
    });
  }

  update(point) {
    this.#point = point.copy();
    const destination = this.#destinations[point.destination];
    this.#header.update(point);
    this.#setSectionOffers();
    if (this.#sectionOffers) {
      this.#details.append(this.#sectionOffers.getElement());
    }
    this.#setSectionDestination(destination);
  }

  default() {
    if (this.#sectionOffers) {
      this.#sectionOffers.getElement().remove();
      this.#sectionOffers = false;
    }
    if (this.#sectionDestination) {
      this.#sectionDestination.remove();
      this.#sectionDestination = false;
    }
    this.#header.default();
  }

  #setSectionOffers() {
    this.#sectionOffers =
      this.#point.type && this.#offers[this.#point.type].length > 0 ?
        new FormOffersView(this.point.offers, this.#offers[this.point.type]) : false;
  }

  #setSectionDestination(destination) {
    const isNew = this.#point.id === -1;
    this.#sectionDestination = destination.description || (destination.pictures.length > 0 && isNew) ?
      new FormDestinationView(destination, isNew).getElement() : false;
    if (this.#sectionDestination) {
      this.#details.append(this.#sectionDestination);
    }
  }

  set point(point) {
    this.#point = point;
  }

  get point() {
    return this.#point;
  }

  get buttonCancel() {
    return this.#header.buttonCancel;
  }

  get buttonSubmit() {
    return this.#header.buttonSubmit;
  }

  get header() {
    return this.#header;
  }

  set marginLeft(value) {
    this.#element.style.marginLeft = `${value}px`;
  }

  set marginRight(value) {
    this.#element.style.marginRight = `${value}px`;
  }

  set disabled(disabled) {
    this.#header.disabled = disabled;
    if (this.#sectionOffers) {
      this.#sectionOffers.disabled = disabled;
    }
  }

  getElement = () => this.#element;

  clearStyle() {
    this.#element.style = '';
  }
}
