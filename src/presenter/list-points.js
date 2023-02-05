import EditFormView from '../view/form/edit-form-view.js';
import dayjs from 'dayjs';
import {FormFields, PromptTexts, ViewMode} from '../settings';
import ItemRollup from './item-rollup';
import Point from '../model/point';
import ItemNewForm from './item-new-form';
import MainView from '../view/list/main-view';

export default class ListPoints {
  #model;
  #points;
  #itemNewPoint;
  #form;
  #onChangeState;
  #listView;
  onFormSubmit;
  onChangeFavorite;

  constructor() {
    this.#listView = new MainView();
    this.#listView.prompt = PromptTexts.loading;
  }

  start = (model) => {
    this.#model = model;
    this.#form = new EditFormView(this.#model.types, this.#model.destinations, this.#model.typeOfOffers);
    this.#model.points.list.forEach((point) => {
      this.#createNewItem(point);
    });
    this.#itemNewPoint = new ItemNewForm(this.#form);
    this.#itemNewPoint.list = this.#listView.list;
    this.#itemNewPoint.onSubmit = this.onFormSubmit;
    document.addEventListener('keydown', this.#onKeyDown);
  };

  set onSubmit(onSubmit) {
    this.onFormSubmit = (mode, point, button) => {
      button.textContent = mode.directText;
      onSubmit(mode, point, (options) => {
        button.textContent = mode.backText;
        this[mode.back](options);
      }, () => {
        button.textContent = mode.backText;
        this.#onError();
      });
    };
  }

  set onCancel(onCancel) {
    this.#itemNewPoint.onCancel = onCancel;
  }

  get view() {
    return this.#listView;
  }

  set onChangeState(onChangeState) {
    this.#onChangeState = onChangeState;
  }

  #onError = () => {
    this.#form.shake();
  };

  createNewEvent = () => {
    this.#itemNewPoint.point = new Point();
    this.#itemNewPoint.showForm();
    this.#setElement();
  };

  #createNewItem = (point) => {
    this.#listView.new = new ItemRollup(
      this.#form,
      point,
      this.#model.destinations[point.destination].name,
      point.offers.length > 0 ? this.#model.getOffers(point.type, point.offers) : false,
      this.onFormSubmit,
      this.onChangeFavorite
    );
  };

  #fillList = () => {
    if (this.#form.owner) {
      this.#form.owner.hideForm();
    }
    this.#listView.fill(this.#points.list);
  };

  #setElement = () => {
    const isNew = this.#form.owner instanceof ItemNewForm;
    if (!isNew) {
      this.#onChangeState(this.#points.length === 0);
    }
    this.#listView.view = this.#points.length > 0 || isNew ? ViewMode.list : ViewMode.prompt;
  };

  filterPoints = (mode, sortMode) => {
    this.#points = this.#model.pointsFilter(mode, dayjs());
    this.#points.sort(sortMode);
    this.#fillList();
    this.#listView.prompt = PromptTexts[mode];
    this.#setElement();
  };

  sort = (options) => {
    this.#points.sort(options);
    this.#fillList();
  };

  #onKeyDown = (evt) => {
    if (this.#form.owner && evt.key === 'Escape') {
      this.#form.owner.hideForm();
    }
  };

  addPoint = (options) => {
    const point = options.point;
    const index = this.#points.list.findIndex((elem) => elem.dateFrom > point.dateFrom);
    this.#createNewItem(point);
    if (index > -1) {
      const beforeID = this.#points.list[index].id;
      this.#points.list.splice(index, 0, point);
      this.#listView.insert(point.id, beforeID);
    } else {
      this.#points.list.push(point);
      this.#listView.add(point.id);
    }
    this.#setElement();
    this.hideForm();
  };

  alterPoint = (options) => {
    const point = options.point;
    const changes = options.changes;
    const destination = this.#model.destinations[point.destination].name;
    const offers = changes.includes(FormFields.OFFERS) && point.offers.length > 0 ?
      this.#model.getOffers(point.type, point.offers) : false;
    if (changes.includes(FormFields.DATE_FROM) || changes.includes(FormFields.DATE_TO)) {
      changes.push(FormFields.DURATION);
    }
    if (changes.includes(FormFields.DESTINATION) || changes.includes(FormFields.TYPE)) {
      changes.push(FormFields.TITLE);
    }
    const relocationOptions = this.#points.relocation(point, changes);
    if (relocationOptions) {
      this.#listView.relocation(relocationOptions);
    }
    this.#form.owner.point = point;
    this.#form.owner.routePoint.update(point, changes, destination, offers);
    this.hideForm();
  };

  hideForm = () => {
    this.#form.owner.hideForm();
  };

  changeFavorite = (point) => {
    this.#listView.changeFavorite(point.id, point.isFavorite);
  };

  deleteItem = (options) => {
    const id = options.id;
    this.#points.delete(id);
    this.#listView.delete(id);
    this.#setElement();
  };

  blockInterface(block) {
    this.#listView.disabled = block;
    this.#form.disabled = block;
  }
}
