import {createElement} from '../render.js';
import FormOffersView from './form-offers-view';
import FormDestinationView from './form-destination-view';
import FormHeaderView from './form-header-view';

export default class EditFormView{
  #point;
  #destinations;
  #TEMPL = `<form class="event event--edit" action="#" method="post">
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
      if (this.#sectionOffers){
        this.#sectionOffers.remove();
      }
      this.#sectionOffers = this.#offers[this.#point.type].length > 0 ?
        new FormOffersView(this.point.offers, this.#offers[this.point.type]).getElement() : false;
      if (this.#sectionOffers){
        this.#details.prepend(this.#sectionOffers);
      }
    };
    this.#header.onChangeDestination = (destination) => {
      const isNew = this.#point.id === -1;
      this.#point.destination = destination.id;
      if (this.#sectionDestination){
        this.#sectionDestination.remove();
      }
      this.#sectionDestination = destination.description || (destination.pictures.length > 0 && isNew) ?
        new FormDestinationView(destination, isNew).getElement() : false;
      if (this.#sectionDestination){
        this.#details.append(this.#sectionDestination);
      }
    };
    this.header.onChangeDate = (key, value) => {
      this.#point[key] = value;
    };
    this.header.onChangePrice = (price) => {
      this.#point.basePrice = price;
    };
    this.#element = createElement(this.#TEMPL);
    this.#details = this.#element.querySelector('.event__details');
    this.#element.prepend(this.#header.getElement());
    this.#element.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.buttonSubmit.textContent = 'Saving';
      this.owner.submit();
    });
    this.buttonCancel.addEventListener('click', () => {
      this.owner.cancel();
    });
  };

  update(point){
    this.#point = point.copy();
    const isNew = this.#point.id === -1;
    const destination = this.#destinations[point.destination];
    this.#header.update(point);
    this.#sectionOffers =
      this.#point.type && this.#offers[this.#point.type].length > 0 ?
        new FormOffersView(this.point.offers, this.#offers[this.point.type]).getElement() : false;
    if (this.#sectionOffers){
      this.#details.append(this.#sectionOffers);
    }
    this.#sectionDestination = destination.description || (destination.pictures.length > 0 && isNew) ?
      new FormDestinationView(destination, isNew).getElement() : false;
    if (this.#sectionDestination){
      this.#details.append(this.#sectionDestination);
    }
  }

  default(){
    if (this.#sectionOffers){
      this.#sectionOffers.remove();
      this.#sectionOffers = false;
    }
    if (this.#sectionDestination){
      this.#sectionDestination.remove();
      this.#sectionDestination = false;
    }
    this.#header.default();
  };

  set point(point){
    this.#point = point;
  };

  get point(){
    return this.#point;
  }
  get buttonCancel(){
    return this.#header.buttonCancel;
  };

  get buttonSubmit(){
    return this.#header.buttonSubmit;
  };

  get header(){
    return this.#header;
  };

  getElement = ()=>this.#element;
};
