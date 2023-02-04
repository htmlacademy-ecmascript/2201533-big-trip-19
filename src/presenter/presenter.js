import Sorting from '../view/sorting/sorting.js';
import Filters from '../view/filters/filters.js';
import Info from '../view/info.js';
import IndexView from '../view/index-view';
import ListPoints from './list-points';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import {BLOCK_LIMITS} from '../settings';

export default class Presenter {
  #sort;
  #filter;
  #filterMode;
  #info;
  #model;
  #list;
  #index;
  #blocker;

  constructor(model) {
    this.#model = model;
    this.#sort = new Sorting();
    this.#filter = new Filters(this.#onChangeFilter);
    this.#info = new Info();
    this.#list = new ListPoints();
    this.#index = new IndexView(this.#filter, this.#sort, this.#list, this.#info);
    this.#blocker = new UiBlocker(BLOCK_LIMITS);
  }

  start = () => {
    this.#model.init(() => {
      this.#index.sort = this.#model.points.length === 0;
      this.#index.start(this.showAddForm);
      this.#recalculate();
      this.#list.onSubmit = this.onSubmit;
      this.#list.onChangeFavorite = this.onChangeFavorite;
      this.#list.init(this.#model);
      this.#list.onCancel = () => this.onCloseAddForm();
      this.#list.onChangeState = this.#onChangeListState;
      this.#sort.onChange = this.onSort;
      this.#filter.start();
    }, (errors) => {
      this.#list.view.showErrors(errors);
    });
  };

  showAddForm = () => {
    let needSort = this.#sort.reset();
    needSort = needSort && !this.#filter.reset();
    if (needSort) {
      this.#list.sort(this.#sort.currentMode);
    }
    this.#list.createNewEvent();
  };

  #onChangeListState = (emptyList) => {
    this.#index.sort = emptyList;
  };

  #onChangeFilter = (mode) => {
    this.#filterMode = mode;
    this.#list.filterPoints(this.#filterMode, this.#sort.currentMode);
  };

  onCloseAddForm = () => {
    this.#index.disabled = false;
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
      this.#blockInterface(false);
      this.#list.hideForm();
    }
  };

  #blockInterface = (block) => {
    this.#list.blockInterface(block);
    this.#filter.disabled = block;
    this.#sort.disabled = block;
    this.#index.disabled = block;
    const action = block ? 'block' : 'unblock';
    this.#blocker[action]();
  };

  #recalculate = () => {
    if (this.#model.info.data) {
      this.#info.data = this.#model.info.data;
    }
    this.#index.info = !(this.#model.info.data);
    this.#filter.disableItems = this.#model.existFilters;
  };
}
