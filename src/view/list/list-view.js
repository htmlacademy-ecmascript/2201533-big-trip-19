import {createElement} from '../render';
import {ENDPOINT, PromptTexts} from '../../settings';
import DOMPurify from 'dompurify';

export default class ListView {
  #element;
  #list;
  #prompt;
  #items = {};

  constructor() {
    this.#list = createElement('<ul class="trip-events__list"></ul>');
    this.#prompt = createElement('<p class="trip-events__msg"></p>');
    this.#element = this.#prompt;
  }

  set prompt(prompt) {
    this.#prompt.textContent = prompt;
  }

  set disabled(disabled) {
    Object.values(this.#items).forEach((item) => {item.disabled = disabled;});
  }

  getElement = () => this.#element;

  get element() {
    return this.#element;
  }

  get list() {
    return this.#list;
  }

  set element(tag) {
    const tags = {
      UL: this.#list,
      P: this.#prompt
    };
    if (this.#element) {
      if (this.#element.tagName === tag) {
        return;
      }
      this.#element.replaceWith(tags[tag]);
      this.#element = tags[tag];
    } else {
      this.#element = tags[tag];
    }
  }

  fill(list) {
    this.#list.replaceChildren();
    list.forEach((point) => {
      this.#list.append(this.#items[point.id].getElement());
    });
  }

  new(item) {
    this.#items[item.idPoint] = item;
  }

  add(id) {
    this.#list.append(this.#items[id].getElement());
  }

  insert(idPoint, idBefore) {
    this.#list.insertBefore(this.#items[idPoint].getElement(), this.#items[idBefore].getElement());
  }

  relocation(relocationOptions) {
    const item = this.#items[relocationOptions.delete].getElement();
    item.remove();
    if (relocationOptions.before) {
      this.#list.insertBefore(item, this.#items[relocationOptions.before].getElement());
    } else {
      this.#list.append(item);
    }
  }

  delete(id) {
    this.#items[id].getElement().remove();
    delete this.#items[id];
  }

  changeFavorite = (id, isFavorite) => {
    this.#items[id].routePoint.favoriteButton.state = isFavorite;
  };

  showErrors(errors) {
    const errorsStr = Array.from(errors, (err) =>
      `${PromptTexts.error.replace(ENDPOINT, err.endpoint)} ${err.status}, ${err.statusText}`
    ).join('\n');
    this.#prompt.innerText = DOMPurify.sanitize(errorsStr);
  }
}
