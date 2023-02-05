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
  #isNew;
  submit;
  cancel;

  constructor(types, destinations, offers) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this.#header = new FormHeaderView(types, destinations);
    this.init();
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

  init = () => {
    super._createElement();
    this.#isNew = false;
    this.#header.callbacks = this.#callbacks;
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

  initNew = (point) => {
    this.#isNew = true;
    this.point = point;
    this.#header.initNew();
    this.buttonCancel.textContent = 'Cancel';
  };

  update = (point, onRollUp) => {
    this.point = point;
    const destination = this.#destinations[point.destination];
    this.#header.update(point, onRollUp);
    this.#setSectionOffers();
    if (this.#sectionOffers) {
      this.#details.append(this.#sectionOffers.element);
    }
    this.#setSectionDestination(destination);
  };

  setDefault = () => {
    this.#isNew = false;
    if (this.#sectionOffers) {
      this.#sectionOffers.element.remove();
      this.#sectionOffers = false;
    }
    if (this.#sectionDestination) {
      this.#sectionDestination.element.remove();
      this.#sectionDestination = false;
    }
    this.#header.setDefault();
  };

  #callbacks = {
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

  #setSectionOffers = () => {
    this.#sectionOffers =
      this.point.type && this.#offers[this.point.type].length > 0 ?
        new FormOffersView(this.point.offers, this.#offers[this.point.type]) : false;
  };

  #setSectionDestination = (destination) => {
    this.#sectionDestination = destination.description || (destination.pictures.length > 0 && this.#isNew) ?
      new FormDestinationView(destination, this.#isNew) : false;
    if (this.#sectionDestination) {
      this.#details.append(this.#sectionDestination.element);
    }
  };
}
