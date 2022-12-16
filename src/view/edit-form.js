import {createElement} from '../render.js';
import {ICONS} from '../setings.js';

class Details{
  #TEMPL = `<section class="event__details"></section>`;
  #element;
  constructor() {
    this.#element = createElement(this.#TEMPL);
  };
  getElement = ()=>this.#element;
}

class GroupTime{
  #TEMPL;
  #element;
  constructor() {
    this.#TEMPL =
      `
      `;
    this.#element = createElement(this.#TEMPL);
  };
  getElement = ()=>this.#element;
}

class GroupDestination{
  #TEMPL;
  #element;
  constructor(id, type, destination, destinations) {
    this.#TEMPL =
      `<div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-${id}">
          Flight
        </label>
        <input class="event__input  event__input--destination" id="event-destination-${id}" type="text"
          name="event-destination" value="${destination}" list="destination-list-${id}">
        <datalist id="destination-list-${id}">
          ${Array.from(destinations, (elem)=>`<option value="${elem.id}">${elem.name}</option>`).join('')}
        </datalist>
      </div>`;
    this.#element = createElement(this.#TEMPL);
//    console.log(this.#TEMPL);
  };
  getElement = ()=>this.#element;
}

class TypeItem{
  #TEMPL;
  #element;
  constructor(id, type) {
    this.#TEMPL =
      `<div class="event__type-item">
        <input id="event-type-taxi-${id}" class="event__type-input  visually-hidden"
          type="radio" name="event-type" value="${type}">
        <label class="event__type-label  event__type-label--${type}" for="event-type-taxi-${id}">
          ${type[0].toUpperCase()}${type.slice(1)}</label>
      </div>`;
    this.#element = createElement(this.#TEMPL);
  };
  getElement = ()=>this.#element;
}

class Wrapper{
  #TEMPL;
  #element;
  constructor(point, types, destinations) {
    this.#TEMPL =
      `<div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${point.id}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="${ICONS.PATH}${point.type}${ICONS.EXT}" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${point.id}" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
          </fieldset>
        </div>
      </div>`
    this.#element = createElement(this.#TEMPL);
    const container = this.#element.querySelector('fieldset');
    types.forEach(type=>container.append(new TypeItem(point.id, type).getElement()));
    this.#element.append(new GroupDestination(
      point.id,
      point.type,
      point.destination,
      destinations
    ));

  };
  getElement = ()=>this.#element;
}

class Header{
  #TEMPL = `<header class="event__header"></header>`;
  #element;
  constructor(point, types, destinations) {
    this.#element = createElement(this.#TEMPL);
    this.#element.append(new Wrapper(point, types, destinations).getElement());
  };
  getElement = ()=>this.#element;
}

export default class EditFormView{
  #id;
  #TEMPL = `<form class="event event--edit" action="#" method="post"></form>`;
  #element;
  constructor(point, types, destinations) {
    this.#id = point.id;
    this.#element = createElement(this.#TEMPL);
    this.#element.append(new Header(point, types, destinations).getElement());
  };
  getElement = ()=>this.#element;
}


const tmp =
  `<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 12:25">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 13:35">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="160">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>

  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
          <label class="event__offer-label" for="event-offer-luggage-1">
            <span class="event__offer-title">Add luggage</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">50</span>
          </label>
        </div>

        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" checked>
          <label class="event__offer-label" for="event-offer-comfort-1">
            <span class="event__offer-title">Switch to comfort</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">80</span>
          </label>
        </div>
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal">
          <label class="event__offer-label" for="event-offer-meal-1">
            <span class="event__offer-title">Add meal</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">15</span>
          </label>
        </div>
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-seats-1" type="checkbox" name="event-offer-seats">
          <label class="event__offer-label" for="event-offer-seats-1">
            <span class="event__offer-title">Choose seats</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">5</span>
          </label>
        </div>
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-train-1" type="checkbox" name="event-offer-train">
          <label class="event__offer-label" for="event-offer-train-1">
            <span class="event__offer-title">Travel by train</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">40</span>
          </label>
        </div>
      </div>
    </section>
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">Chamonix-Mont-Blanc (usually shortened to Chamonix) is a resort area near the junction of France, Switzerland and Italy. At the base of Mont Blanc, the highest summit in the Alps, it's renowned for its skiing.</p>
    </section>
  </section>
</form>
  `
