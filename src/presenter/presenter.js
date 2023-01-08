import Sorting from '../view/sorting.js';
import Filters from '../view/filters.js';
import Info from '../view/info.js';
import {render, RenderPosition} from '../view/render.js';
import ListPoints from '../view/list/list-points.js';

export default class Presenter {
  #sort;
  #filter;
  #filterMode;
  #info;
  #model;
  #list;
  #eventAddButton;
  #sortContainer;
  #infoContainer;
  #onChangeFilter = (mode) => {
    this.#filterMode = mode;
    this.#list.filterPoints(this.#filterMode);
  };

  constructor(model) {
    this.#model = model;
    this.#sort = new Sorting();
    this.#filter = new Filters(this.#onChangeFilter);
    this.#info = new Info();
  }

  #recalc = () => {
    if (this.#model.points.length) {
      this.#info.data = this.#model.info.data;
      render(this.#info, this.#infoContainer, RenderPosition.AFTERBEGIN);
    }
  };

  start = () => {
    this.#sortContainer = document.querySelector('.trip-events');
    const filterContainer = document.querySelector('.trip-controls__filters');
    render(this.#filter, filterContainer);
    this.#infoContainer = document.querySelector('.trip-main');
    this.#eventAddButton = document.querySelector('.trip-main__event-add-btn');
    this.#eventAddButton.disabled = true;
    this.#model.init(() => {
      if (this.#model.points.length) {
        render(this.#sort, this.#sortContainer, RenderPosition.AFTERBEGIN);
      }
      this.#recalc();
      this.#list = new ListPoints(this.#model);
      this.#list.onSubmit = this.onSubmit;
      this.#list.init();
      this.#list.onChangeFavourite = this.onChangeFavourite;
      this.#list.onCancel = () => this.onCloseAddForm();
      this.#list.onChangeState = this.#onChangeListState;
      this.#sort.onChange = this.onSort;
      this.#filter.reset();
      this.#eventAddButton.disabled = false;
      this.#eventAddButton.addEventListener('click', () => {
        this.#eventAddButton.disabled = true;
        this.#filter.reset();
        this.#list.newEvent();
      });
      render(this.#list, this.#sortContainer);
    });
  };

  onSubmit = (mode, point, onSuccess, onError) => {
    if (this.#model[mode.direct](point, (options) => {
      this.#info.data = this.#model.info.data;
      onSuccess(options);
    }, onError)){
      this.#list.hideForm();
    }
  };

  onCloseAddForm = () => {
    this.#eventAddButton.disabled = false;
  };

  onChangeFavourite = (point) => {
    this.#model.changeFavourite(point, this.#list.changeFavourite);
  };

  onSort = (id, order) => {
    this.#list.sort(id, order);
  };

  #renderSort = (invisible) => {
    if (invisible) {
      this.#sort.getElement().remove();
    }
    else {
      render(this.#sort, this.#sortContainer, RenderPosition.AFTERBEGIN);
    }
  };

  #onChangeListState = (emptyList) => {
    this.#renderSort(emptyList);
  };
}
