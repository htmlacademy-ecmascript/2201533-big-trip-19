import {render, RenderPosition} from '../framework/render';

export default class IndexView {
  #eventAddButton;
  #sortContainer;
  #infoContainer;
  #list;
  #sort;
  #filter;
  #info;
  #infoVisible = false;
  #sortVisible = false;

  constructor(filter, sort, list, info) {
    this.#filter = filter;
    this.#sort = sort;
    this.#list = list;
    this.#info = info;
    this.init();
  }

  init = () => {
    this.#sortContainer = document.querySelector('.trip-events');
    const filterContainer = document.querySelector('.trip-controls__filters');
    render(this.#filter, filterContainer);
    this.#infoContainer = document.querySelector('.trip-main');
    this.#eventAddButton = document.querySelector('.trip-main__event-add-btn');
    this.#eventAddButton.disabled = true;
    render(this.#list.view.element, this.#sortContainer);
  };

  start = (onClick) => {
    this.#eventAddButton.disabled = false;
    this.#eventAddButton.addEventListener('click', () => {
      this.#eventAddButton.disabled = true;
      onClick();
    });
  };

  set disabled(disabled) {
    this.#eventAddButton.disabled = disabled;
  }

  set sort(invisible) {
    if (invisible) {
      if (this.#sortVisible) {
        this.#sort.element.remove();
      }
    } else {
      render(this.#sort, this.#sortContainer, RenderPosition.AFTERBEGIN);
    }
    this.#sortVisible = !invisible;
  }

  set info(invisible) {
    if (invisible) {
      if (this.#infoVisible) {
        this.#info.element.remove();
      }
    } else {
      render(this.#info, this.#infoContainer, RenderPosition.AFTERBEGIN);
    }
    this.#infoVisible = !invisible;
  }
}
