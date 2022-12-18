import {createElement} from '../render.js';
import {ICONS} from '../setings.js';
import RollupButton from './rollup-btn.js';

class SectionDestinations{
  #TEMPL;
  #element;
  constructor() {
    this.#element = createElement(this.#TEMPL);
  };
  getElement = ()=>this.#element;
}

class SectionOffers{
  #TEMPL;
  #element;
  constructor() {
    this.#element = createElement(this.#TEMPL);
  };
  getElement = ()=>this.#element;
}

class Details{
  #TEMPL = `<section class="event__details"></section>`;
  #element;
  constructor() {
    this.#element = createElement(this.#TEMPL);
  };
  getElement = ()=>this.#element;
}

class GroupPrice{
  #TEMPL;
  #element;
  constructor(id, price) {
    this.#TEMPL =
      `<div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price"
          value="${price}">
      </div>`;
    this.#element = createElement(this.#TEMPL);
  };
  getElement = ()=>this.#element;
}

class GroupTime{
  #TEMPL;
  #element;
  constructor(id, start, end) {
    this.#TEMPL =
      `<div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${id}">From</label>
        <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time"
          value="${start.format('DD/MM/YY HH:mm')}">
          &mdash;
        <label class="visually-hidden" for="event-end-time-${id}">To</label>
        <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time"
          value="${end.format('DD/MM/YY HH:mm')}">
      </div>`;
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
          ${type[0].toUpperCase()}${type.slice(1)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-${id}" type="text"
          name="event-destination" value="${destination.name}" list="destination-list-${id}">
        <datalist id="destination-list-${id}">
          ${Array.from(destinations, (elem)=>`<option value="${elem.name}"></option>`).join('')}
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
  constructor(id, type, checked) {
    this.#TEMPL =
      `<div class="event__type-item">
        <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden"
          type="radio" name="event-type" value="${type}"${checked}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">
          ${type[0].toUpperCase()}${type.slice(1)}</label>
      </div>`;
    this.#element = createElement(this.#TEMPL);
  };
  getElement = ()=>this.#element;
}

class Wrapper{
  #TEMPL;
  #element;
  constructor(point, types) {
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
    types.forEach(type=>container.append(
      new TypeItem(point.id, type, type === point.type ? ' checked': '').getElement()));
    container.addEventListener('change', (evt)=>{console.log(evt.target)});
  };
  getElement = ()=>this.#element;
}

class Header{
  #TEMPL = `<header class="event__header"></header>`;
  #element;
  constructor(point, types,destination, destinations, onRollup) {
    this.#element = createElement(this.#TEMPL);
    this.#element.append(new Wrapper(point, types, destinations).getElement());
    this.#element.append(new GroupDestination(
      point.id,
      point.type,
      destination,
      destinations
    ).getElement());
    this.#element.append(new GroupTime(point.id, point.dateFrom, point.dateTo).getElement());
    this.#element.append(new GroupPrice(point.id, point.basePrice).getElement());
    this.#element.append(createElement(
      '<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>'));
    this.#element.append(createElement('<button class="event__reset-btn" type="reset">Delete</button>'));
    this.#element.append(new RollupButton(onRollup).getElement());
  };
  getElement = ()=>this.#element;
}

export default class EditFormView{
  #point;
  #destination;
  #id;
  #TEMPL = `<form class="event event--edit" action="#" method="post">
              <section class="event__details"></section>
            </form>`;
  #element;
  #header;
  #details;
  #buttonType;
  #iconType;
  #labelType;
  #listTypes;
  #inputDestination;
  #fieldSet;
  #offers;
  #onRollup;
  #sectionOffers;
  #sectionDestination;
  #createOffers = ()=>{
    const pointOffers = this.#point.offers;
    const typeOffers = this.#offers[this.#point.type];
    const id = this.#point.id;
    const offersTemplate =
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${Array.from(typeOffers, offer=>{
          const forID = offer.title.replace(/\s/g,'')
          return `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${forID}-${id}" type="checkbox"
            name="event-offer-${forID}" ${pointOffers.includes(offer.id) ? 'checked' : ''}>
          <label class="event__offer-label" for="event-offer-${forID}-${id}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`
        }).join('')}
    </section>`;
    return createElement(offersTemplate);
  };
  #createDestination = ()=>{
    const destinationTemplate =
    `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${this.#destination.description}</p>
        ${!this.#point.id ?
        `<div class="event__photos-container">
            <div class="event__photos-tape">
              ${Array.from(this.#destination.pictures, (elem)=>
                `<img class="event__photo" src="${elem.src}" alt="${elem.description}">`
              ).join('')}
            </div>`: ''}
        </div>
    </section>`;
    return createElement(destinationTemplate);
  };
  constructor(point, types, destination, destinations, offers, onRollup) {
    this.#point = point;
    this.#id = point.id;
    this.#destination = destination;
    this.#offers = offers;
    const id = !point.id ? '' : point.id;
    const typeTitle = type=>type ? `${type[0].toUpperCase()}${type.slice(1)}` : '';
    const headerTemplate =
    `<header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
          <span class="visually-hidden">Choose event type</span>
<!--        <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">-->
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

        <div class="event__type-list">
<!--          fieldset          -->
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <!--          labelType          -->
        <input class="event__input  event__input--destination" id="event-destination-${id}" type="text"
          name="event-destination" value="${destination.name}" list="destination-list-${id}">
        <datalist id="destination-list-${id}">
          ${Array.from(destinations, (elem)=>`<option value="${elem.name}"></option>`).join('')}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${id}">From</label>
        <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${point.dateFrom.format('DD/MM/YY HH:mm')}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-${id}">To</label>
        <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${point.dateTo.format('DD/MM/YY HH:mm')}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${point.basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <!--          rollupButton          -->
    </header>`;

    const fieldSetTemplate =
      `<fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${Array.from(types, type=>`<div class="event__type-item">
            <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio"
              name="event-type" value="${type}"${type === point.type ? ' checked': ''}>
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${typeTitle(type)}</label>
          </div>`).join('')}
      </fieldset>`;

    const labelTypeTemplate = `<label class="event__label  event__type-output" for="event-destination-${id}">
          ${typeTitle(point.type)}
        </label>`;

    const iconTypeTemplate = `<img class="event__type-icon" width="17" height="17"
      src="${ICONS.PATH}${point.type}${ICONS.EXT}" alt="Event type icon">`;


    this.#onRollup = ()=>{
      onRollup(this.#id, this.#element)
    };

    this.#header = createElement(headerTemplate);
    this.#iconType = createElement(iconTypeTemplate);
    this.#buttonType = this.#header.querySelector('.event__type-btn');
    this.#buttonType.addEventListener('click', ()=>{
      console.log(`wrapper: ${this.#listTypes.style.display}`);
      const states = {
        block: 'none',
        none: 'block'
      };
      this.#listTypes.style.display = states[this.#listTypes.style.display];
    });
    this.#labelType = createElement(labelTypeTemplate);
    this.#fieldSet = createElement(fieldSetTemplate);
    this.#listTypes = this.#header.querySelector('.event__type-list');
    this.#inputDestination = this.#header.querySelector(`#event-destination-${id}`);
    this.#inputDestination.addEventListener('change', (evt)=>{
      const destination = destinations.find(element=>element.name === evt.target.value);
      if (destination){
        this.#destination = destinations.find(element=>element.name === evt.target.value);
        this.#point.destination = this.#destination.id;
        if (this.#sectionDestination){
          this.#sectionDestination.remove();
        }
        this.#sectionDestination = this.#destination.description || (this.#destination.pictures.length > 0 && !point.id) ?
          this.#createDestination() : false;
        if (this.#sectionDestination){
          this.#details.append(this.#sectionDestination);
        }
      }
      console.log(evt.target);
    });
    this.#fieldSet.addEventListener('change', (evt)=>{
      const type = evt.target.value;
      this.#listTypes.style.display = 'none';
      this.#point.type = type;
      this.#point.offers = [];
      this.#iconType.src = `${ICONS.PATH}${type}${ICONS.EXT}`;
      this.#labelType.textContent = typeTitle(type);
      if (this.#sectionOffers){
        this.#sectionOffers.remove();
      }
      this.#sectionOffers = offers[point.type].length > 0 ? this.#createOffers() : false;
      if (this.#sectionOffers){
        this.#details.prepend(this.#sectionOffers);
      }
    });
    this.#buttonType.append(this.#iconType);
    this.#header.querySelector('.event__field-group--destination').prepend(this.#labelType);
    this.#listTypes.append(this.#fieldSet);
    if (onRollup){
      this.#header.append(new RollupButton(this.#onRollup).getElement());
    }
    this.#element = createElement(this.#TEMPL);
    this.#details = this.#element.querySelector('.event__details');
    this.#element.prepend(this.#header);
    this.#sectionOffers =
      point.type && offers[point.type].length > 0 ? this.#createOffers() : false;
    if (this.#sectionOffers){
      this.#details.append(this.#sectionOffers);
    }
    this.#sectionDestination = destination.description || (destination.pictures.length > 0 && !point.id) ?
      this.#createDestination() : false;
    if (this.#sectionDestination){
      this.#details.append(this.#sectionDestination);
    }
  };
  getElement = ()=>this.#element;
};



