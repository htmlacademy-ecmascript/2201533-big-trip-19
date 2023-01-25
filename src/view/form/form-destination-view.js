import AbstractView from '../../framework/view/abstract-view';
import DOMPurify from 'dompurify';

export default class FormDestinationView extends AbstractView {
  #destination;
  #isNew;

  constructor(destination, isNew) {
    super();
    this.#destination = destination;
    this.#isNew = isNew;
  }

  get template() {
    return DOMPurify.sanitize(
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${this.#destination.description}</p>
      ${this.#isNew ? `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${Array.from(this.#destination.pictures, (elem) =>
    `<img class="event__photo" src="${elem.src}" alt="${elem.description}">`).join('')}
        </div>` : ''}
      </div>
    </section>`);
  }
}
