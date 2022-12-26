import {createElement} from '../render.js';
import {ICONS} from '../setings.js';
import RollupButton from './rollup-btn.js';
import flatpickr from 'flatpickr';
import css from 'flatpickr/dist/flatpickr.css'
import dayjs from 'dayjs';

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
  #onSubmit;
  #onReset;
  #sectionOffers;
  #sectionDestination;
  #buttonCancel;
  #mapOffers = new Map;
  #createOffers = ()=>{
    const pointOffers = this.#point.offers;
    const typeOffers = this.#offers[this.#point.type];
    const id = this.#id;
    this.#mapOffers.clear() ;
    const offersTemplate =
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${Array.from(typeOffers, offer=>{
          const forID = `event-offer-${offer.title.replace(/\s/g,'')}`;
          this.#mapOffers.set(forID, offer.id);
          return `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="${forID}${id}" type="checkbox"
            name="${forID}" ${pointOffers.includes(offer.id) ? 'checked' : ''}>
          <label class="event__offer-label" for="${forID}${id}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`
        }).join('')}
    </section>`;
    const element = createElement(offersTemplate);
    element.addEventListener('change', this.#onCheckOffer)
    return element;
  };
  #createDestination = ()=>{
    const destinationTemplate =
    `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${this.#destination.description}</p>
        ${!this.#id ?
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
  #onCheckOffer = (evt)=>{
    const checkBox = evt.target;
    if (checkBox.checked){
      this.#point.offers.push(this.#mapOffers.get(checkBox.name));
    }
    else{
      this.#point.offers.splice(this.#point.offers.indexOf(this.#mapOffers.get(checkBox.name)), 1);
    }
  };
  constructor(point, types, destination, destinations, offers, onRollup) {
    this.#point = point;
    this.#id = point.id === -1 ? '' : `-${point.id}`;
    this.#destination = destination;
    this.#offers = offers;

    const id = this.#id;
    const typeTitle = type=>type ? `${type[0].toUpperCase()}${type.slice(1)}` : '';
    this.#onRollup = onRollup;
    this.#header = createElement(`<header class="event__header"></header>`);
    const createTypeWraperr = ()=>{
      const wrapper = createElement(
      `<div class="event__type-wrapper">
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
      </div>
      `);
      const buttonType = createElement(
      `<label class="event__type  event__type-btn" for="event-type-toggle-${id}">
          <span class="visually-hidden">Choose event type</span>
        </label>
      `);
      const iconType = createElement(`<img class="event__type-icon" width="17" height="17"
            src="${ICONS.PATH}${point.type}${ICONS.EXT}" alt="Event type icon">`);
      buttonType.append(iconType);
      const listTypes = createElement(`<div class="event__type-list"></div>`);
      const fieldSet = createElement(
        `<fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
            ${Array.from(types, type=>`<div class="event__type-item">
              <input id="event-type-${type}${id}" class="event__type-input  visually-hidden" type="radio"
                name="event-type" value="${type}"${type === point.type ? ' checked': ''}>
              <label class="event__type-label  event__type-label--${type}" for="event-type-${type}${id}">${typeTitle(type)}</label>
            </div>`).join('')}
        </fieldset>
      `);
      fieldSet.addEventListener('change', (evt)=>{
        const type = evt.target.value;
        listTypes.style.display = 'none';
        this.#point.type = type;
        this.#point.offers = [];
        iconType.src = `${ICONS.PATH}${type}${ICONS.EXT}`;
        this.#labelType.textContent = typeTitle(type);
        if (this.#sectionOffers){
          this.#sectionOffers.remove();
        }
        this.#sectionOffers = offers[point.type].length > 0 ? this.#createOffers() : false;
        if (this.#sectionOffers){
          this.#details.prepend(this.#sectionOffers);
        }
      });

      buttonType.addEventListener('click', ()=>{
        const states = {
          block: 'none',
          none: 'block',
          '': 'block'
        };
        listTypes.style.display = states[listTypes.style.display];
      });

      listTypes.append(fieldSet);
      wrapper.append(buttonType);
      wrapper.append(listTypes);
      return wrapper;
    };
    const createGroupDestination = ()=>{
      const groupDestination = createElement(
        `<div class="event__field-group  event__field-group--destination">
        <!--          labelType           -->
        <!--          input destination   -->
        <datalist id="destination-list${id}">
          ${Array.from(destinations, (elem)=>`<option value="${elem.name}"></option>`).join('')}
        </datalist>
      </div>`
      );
      this.#labelType = createElement(`<label class="event__label  event__type-output" for="event-destination${id}">
          ${typeTitle(point.type)}
        </label>`);

      const inputDestination = createElement(
        `<input class="event__input  event__input--destination" id="event-destination${id}" type="text"
          name="event-destination" value="${destination.name}" list="destination-list${id}">
      `);
      inputDestination.addEventListener('change', (evt)=>{
        const destination = destinations.find(element=>element.name === evt.target.value);
        if (destination){
          this.#destination = destination;
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
      });
      groupDestination.prepend(inputDestination);
      groupDestination.prepend(this.#labelType);
      return groupDestination;
    };
    const createGroupTime = ()=>{
      const element = createElement('<div class="event__field-group  event__field-group--time"></div>');
      const fields = [
        {
          name: 'start',
          title: 'From',
          field: 'dateFrom',
          tail: '&mdash;'
        },
        {
          name: 'end',
          title: 'To',
          field: 'dateTo',
          tail: ''
        }
      ];
      const getLabel = (title)=>createElement(
        `<label class="visually-hidden" for="event-start-time${id}">${title}</label>`);

      const getInput = (name, field)=>{
        const input = createElement(
          `<input class="event__input  event__input--time" id="event-${name}-time${id}" type="text"
          name="event-${name}-time" value="${point[field].format('DD/MM/YY HH:mm')}">`
        );
        flatpickr(input, {
          enableTime: true,
          dateFormat: "d/m/y H:i",
        });
        input.addEventListener('change', (evt)=>{
          this.#point[field] = dayjs(evt.target.value, 'DD/MM/YY HH:mm');
        });
        return input;
      };

      fields.forEach(field=>{
        element.append(getLabel(field.title));
        element.append(getInput(field.name, field.field));
        element.append(field.tail);
      });
      return element;
    };
    const createGroupPrice = ()=>{
      const group = createElement(
        `<div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price${id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
      </div>
      `);
      const input = createElement(`<input class="event__input  event__input--price" id="event-price${id}"
        type="text" name="event-price" value="${point.basePrice}">`);
      input.addEventListener('change', ()=>{
        this.#point.basePrice = parseInt(input.value, 10);
      });
      input.addEventListener('input', ()=>{
        input.value = input.value ? parseInt(input.value.replace(/\D/,''), 10) : 0;
      });
      group.append(input);
      return group;
    };
    this.#buttonCancel = createElement(`<button class="event__reset-btn" type="reset">${id ? 'Delete' : 'Cancel'}</button>`);

    this.#header.append(createTypeWraperr());
    this.#header.append(createGroupDestination());
    this.#header.append(createGroupTime());
    this.#header.append(createGroupPrice());
    this.#header.append(createElement('<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>'))
    this.#header.append(this.#buttonCancel);
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
  get point(){
    return this.#point;
  }
  get buttonCancel(){
    return this.#buttonCancel;
  };
  getElement = ()=>this.#element;
};
