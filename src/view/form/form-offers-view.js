import {createElementSan} from '../render';

export default class FormOffersView {
  #element;

  constructor(pointOffers, typeOffers) {
    const mapOffers = new Map;
    const offersTemplate =
      `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${Array.from(typeOffers, (offer) => {
    const forID = `event-offer-${offer.title.replace(/\s/g, '')}`;
    mapOffers.set(forID, offer.id);
    return `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="${forID}" type="checkbox"
            name="${forID}" ${pointOffers.includes(offer.id) ? 'checked' : ''}>
          <label class="event__offer-label" for="${forID}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`;
  }).join('')}
    </section>`;
    this.#element = createElementSan(offersTemplate);
    this.#element.addEventListener('change', (evt) => {
      const checkBox = evt.target;
      if (checkBox.checked) {
        pointOffers.push(mapOffers.get(checkBox.name));
      } else {
        pointOffers.splice(pointOffers.indexOf(mapOffers.get(checkBox.name)), 1);
      }
    });
  }

  getElement = () => this.#element;
}
