import Sorting from '../view/sorting/sorting.js';
import Filters from '../view/filters/filters.js';
import Info from '../view/info.js';
import {render, RenderPosition} from '../framework/render.js';
import ListPoints from './list-points.js';

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
  #infoVisible;

  constructor(model) {
    this.#model = model;
    this.#sort = new Sorting();
    this.#filter = new Filters(this.#onChangeFilter);
    this.#info = new Info();
  }

  start = () => {
    this.#sortContainer = document.querySelector('.trip-events');
    const filterContainer = document.querySelector('.trip-controls__filters');
    render(this.#filter, filterContainer);
    this.#infoContainer = document.querySelector('.trip-main');
    this.#eventAddButton = document.querySelector('.trip-main__event-add-btn');
    this.#eventAddButton.disabled = true;
    this.#list = new ListPoints();

    render(this.#list.view.element, this.#sortContainer);
    this.#model.init(() => {
      if (this.#model.points.length) {
        render(this.#sort, this.#sortContainer, RenderPosition.AFTERBEGIN);
      }
      this.#recalculate();
      this.#list.onSubmit = this.onSubmit;
      this.#list.init(this.#model);
      this.#list.onCancel = () => this.onCloseAddForm();
      this.#list.onChangeFavorite = this.onChangeFavorite;
      this.#list.onChangeState = this.#onChangeListState;
      this.#sort.onChange = this.onSort;
      this.#filter.init();
      this.#eventAddButton.disabled = false;
      this.#eventAddButton.addEventListener('click', () => {
        this.#eventAddButton.disabled = true;
        let needSort = this.#sort.reset();
        needSort = needSort && !this.#filter.reset();
        if (needSort) {
          this.#list.sort(this.#sort.currentMode);
        }
        this.#list.newEvent();
      });
    }, (errors) => {
      this.#list.view.showErrors(errors);
    });
  };

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
    this.#blockInterface(true);
    if (this.#model[mode.direct](point, (options) => {
      this.#blockInterface(false);
      this.#recalculate();
      onSuccess(options);
    }, () => {
      this.#blockInterface(false);
      onError();
    })) {
      this.#list.hideForm();
    }
  };

  #onChangeListState = (emptyList) => {
    this.#renderSort(emptyList);
  };

  #blockInterface(block) {
    this.#list.blockInterface(block);
    this.#filter.disabled = block;
    this.#sort.disabled = block;
    this.#eventAddButton.disabled = block;
  }

  #recalculate() {
    if (this.#model.info.data) {
      this.#info.data = this.#model.info.data;
    }
    if (!(this.#infoVisible && Boolean(this.#model.info.data))){
      if (this.#infoVisible) {
        this.#info.element.remove();
      } else {
        render(this.#info, this.#infoContainer, RenderPosition.AFTERBEGIN);
      }
      this.#infoVisible = !this.#infoVisible;
    }
  }

  #renderSort (invisible) {
    if (invisible) {
      this.#sort.element.remove();
    } else {
      render(this.#sort, this.#sortContainer, RenderPosition.AFTERBEGIN);
    }
  }
}
