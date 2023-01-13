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

  constructor(model) {
    this.#model = model;
    this.#sort = new Sorting();
    this.#filter = new Filters(this.#onChangeFilter);
    this.#info = new Info();
  }

  #onChangeFilter = (mode) => {
    this.#filterMode = mode;
    this.#list.filterPoints(this.#filterMode, this.#sort.currentMode);
  };

  onCloseAddForm = () => {
    this.#eventAddButton.disabled = false;
  };

  onChangeFavorite = (point) => {
    this.#model.changeFavorite(point, this.#list.changeFavorite);
  };

  onSort = (options) => {
    this.#list.sort(options);
  };

  onSubmit = (mode, point, onSuccess, onError) => {
    if (this.#model[mode.direct](point, (options) => {
      this.#info.data = this.#model.info.data;
      onSuccess(options);
    }, onError)){
      this.#list.hideForm();
    }
  };

  #onChangeListState = (emptyList) => {
    this.#renderSort(emptyList);
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
      this.#list.onChangeFavorite = this.onChangeFavorite;
      this.#list.onCancel = () => this.onCloseAddForm();
      this.#list.onChangeState = this.#onChangeListState;
      this.#sort.onChange = this.onSort;
      this.#filter.init();
      this.#eventAddButton.disabled = false;
      this.#eventAddButton.addEventListener('click', () => {
        this.#eventAddButton.disabled = true;
        let needSort = this.#sort.reset();
        needSort = needSort && !this.#filter.reset();
        if (needSort){
          this.#list.sort(this.#sort.currentMode);
        }
        this.#list.newEvent();
      });
      render(this.#list, this.#sortContainer);
    });
  };

  #recalc = () => {
    if (this.#model.points.length) {
      this.#info.data = this.#model.info.data;
      render(this.#info, this.#infoContainer, RenderPosition.AFTERBEGIN);
    }
  };

  #renderSort = (invisible) => {
    if (invisible) {
      this.#sort.getElement().remove();
    }
    else {
      render(this.#sort, this.#sortContainer, RenderPosition.AFTERBEGIN);
    }
  };
}
