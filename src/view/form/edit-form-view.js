import FormOffersView from './form-offers-view';
import FormDestinationView from './form-destination-view';
import FormHeaderView from './form-header-view';
import AbstractTrickyView from '../abstract-tricky-view';

export default class EditFormView extends AbstractTrickyView {
  point;
  #destinations;
  #header;
  #details;
  #offers;
  #sectionOffers;
  #sectionDestination;
  submit;
  cancel;

  constructor(types, destinations, offers) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this.#header = new FormHeaderView(types, destinations);
    this._createElement();
  }

  _createElement = () => {
    super._createElement();
    this.#header.callBacks = this.#callBacks;
    this.#details = this.element.querySelector('.event__details');
    this.element.prepend(this.#header.element);
    this.element.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.submit();
    });
    this.buttonCancel.addEventListener('click', () => {
      this.cancel();
    });
  };

  init = (point) => {
    this.point = point;
    this.#header.init();
    this.buttonCancel.textContent = 'Cancel';
  };

  #callBacks = {
    onChangeType: (type) => {
      this.point.type = type;
      this.point.offers = [];
      if (this.#sectionOffers) {
        this.#sectionOffers.element.remove();
      }
      this.#setSectionOffers();
      if (this.#sectionOffers) {
        this.#details.prepend(this.#sectionOffers.element);
      }
    },
    onChangeDestination: (destination) => {
      this.point.destination = destination.id;
      if (this.#sectionDestination) {
        this.#sectionDestination.element.remove();
      }
      this.#setSectionDestination(destination);
    },
    onChangeDate: (key, value) => {
      this.point[key] = value;
    },
    onChangePrice: (price) => {
      this.point.basePrice = price;
    }
  };

  update(point, onRollUp) {
    this.point = point;
    const destination = this.#destinations[point.destination];
    this.#header.update(point, onRollUp);
    this.#setSectionOffers();
    if (this.#sectionOffers) {
      this.#details.append(this.#sectionOffers.element);
    }
    this.#setSectionDestination(destination);
  }

  default() {
    if (this.#sectionOffers) {
      this.#sectionOffers.element.remove();
      this.#sectionOffers = false;
    }
    if (this.#sectionDestination) {
      this.#sectionDestination.element.remove();
      this.#sectionDestination = false;
    }
    this.#header.default();
  }

  #setSectionOffers() {
    this.#sectionOffers =
      this.point.type && this.#offers[this.point.type].length > 0 ?
        new FormOffersView(this.point.offers, this.#offers[this.point.type]) : false;
  }

  #setSectionDestination(destination) {
    const isNew = this.point.id === -1;
    this.#sectionDestination = destination.description || (destination.pictures.length > 0 && isNew) ?
      new FormDestinationView(destination, isNew) : false;
    if (this.#sectionDestination) {
      this.#details.append(this.#sectionDestination.element);
    }
  }

  get buttonCancel() {
    return this.#header.buttonCancel;
  }

  get buttonSubmit() {
    return this.#header.buttonSubmit;
  }

  get template() {
    return `<form class="event event--edit" action="#" method="post">
              <section class="event__details"></section>
            </form>`;
  }

  set disabled(disabled) {
    this.#header.disabled = disabled;
    if (this.#sectionOffers) {
      this.#sectionOffers.disabled = disabled;
    }
  }
}
