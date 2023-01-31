import {ENDPOINT, PromptTexts} from '../../settings';
import DOMPurify from 'dompurify';
import ListView from './list-view';
import PromptView from './prompt-view';

export default class MainView {
  #view;
  #list;
  #prompt;
  #items = {};

  constructor() {
    this.#list = new ListView();
    this.#prompt = new PromptView();
    this.#view = this.#prompt;
  }

  set prompt(prompt) {
    this.#prompt.element.textContent = prompt;
  }

  set disabled(disabled) {
    Object.values(this.#items).forEach((item) => {item.disabled = disabled;});
  }

  get element() {
    return this.#view;
  }

  get list() {
    return this.#list;
  }

  set view(tag) {
    const tags = {
      UL: this.#list,
      P: this.#prompt
    };
    if (this.#view) {
      if (this.#view.element.tagName === tag) {
        return;
      }
      this.#view.element.replaceWith(tags[tag].element);
      this.#view = tags[tag];
    } else {
      this.#view = tags[tag];
    }
  }

  fill(list) {
    this.#list.element.replaceChildren();
    list.forEach((point) => {
      this.#list.element.append(this.#items[point.id].element);
    });
  }

  new(item) {
    this.#items[item.idPoint] = item;
  }

  add(id) {
    this.#list.element.append(this.#items[id].element);
  }

  insert(idPoint, idBefore) {
    this.#list.element.insertBefore(this.#items[idPoint].element, this.#items[idBefore].element);
  }

  relocation(relocationOptions) {
    const item = this.#items[relocationOptions.delete].element;
    item.remove();
    if (relocationOptions.before) {
      this.#list.element.insertBefore(item, this.#items[relocationOptions.before].element);
    } else {
      this.#list.element.append(item);
    }
  }

  delete(id) {
    this.#items[id].element.remove();
    delete this.#items[id];
  }

  changeFavorite = (id, isFavorite) => {
    this.#items[id].routePoint.favoriteButton.state = isFavorite;
  };

  showErrors(errors) {
    if ('status' in errors[0]){
      const errorsStr = Array.from(errors, (err) =>
        `${PromptTexts.error.replace(ENDPOINT, err.endpoint)} ${err.status}, ${err.statusText}`
      ).join('\n');
      this.#prompt.element.innerText = DOMPurify.sanitize(errorsStr);
    }
    else{
      this.#prompt.element.textContent = errors[0];
    }
  }
}
