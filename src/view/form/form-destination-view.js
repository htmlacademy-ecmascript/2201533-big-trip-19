import {createElementSan} from '../render';

export default class FormDestinationView {
  #element;

  constructor(destination, isNew) {
    const destinationTemplate =
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>
        ${isNew ?
    `<div class="event__photos-container">
            <div class="event__photos-tape">
              ${Array.from(destination.pictures, (elem) =>
    `<img class="event__photo" src="${elem.src}" alt="${elem.description}">`
  ).join('')}
            </div>` : ''}
        </div>
    </section>`;
    this.#element = createElementSan(destinationTemplate);
  }

  getElement = () => this.#element;
}
