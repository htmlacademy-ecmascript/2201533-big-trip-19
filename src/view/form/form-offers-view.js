import {createElement, createElementSan} from '../render';

export default class FormOffersView {
  #element;
  #inputs = [];
  constructor(pointOffers, typeOffers) {
    const mapOffers = new Map;
    const sectionTemplate =
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      </section>`;
    const container = createElement('<div class="event__available-offers"></div>');
    typeOffers.forEach((offer) => {
      const forID = `event-offer-${offer.title.replace(/\s/g, '')}`;
      mapOffers.set(forID, offer.id);
      const input = createElementSan(
        `<input class="event__offer-checkbox  visually-hidden" id="${forID}" type="checkbox"
            name="${forID}" ${pointOffers.includes(offer.id) ? 'checked' : ''}>`);
      this.#inputs.push(input);
      const div = createElementSan(
        `<div class="event__offer-selector">
          <label class="event__offer-label" for="${forID}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`)
      div.prepend(input);
      container.append(div)
    })

    this.#element = createElementSan(sectionTemplate);
    this.#element.append(container);
    this.#element.addEventListener('change', (evt) => {
      const checkBox = evt.target;
      if (checkBox.checked) {
        pointOffers.push(mapOffers.get(checkBox.name));
      } else {
        pointOffers.splice(pointOffers.indexOf(mapOffers.get(checkBox.name)), 1);
      }
    });
  }

  set disabled(disabled) {
    this.#inputs.forEach((input) => {input.disabled = disabled});
  }

  getElement = () => this.#element;
}
