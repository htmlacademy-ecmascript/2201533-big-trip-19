import EditFormView from '../view/form/edit-form.js';
import dayjs from 'dayjs';
import {FormFields, PromptTexts, ViewMode} from '../settings';
import ItemRollup from '../view/list/item-rollup';
import Point from '../model/point';
import ItemNewForm from '../view/list/item-new-form';
import ListView from '../view/list/list-view';

export default class ListPoints {
  #model;
  #points;
  #itemNewPoint;
  #form;
  #onSubmit;
  #onChangeState;
  #onChangeFavorite;
  #listView;

  constructor() {
    this.#listView = new ListView();
    this.#listView.prompt = PromptTexts.loading;
  }

  init = (model) => {
    this.#model = model;
    this.#form = new EditFormView(this.#model.types, this.#model.destinations, this.#model.typeOfOffers);
    this.#model.points.list.forEach((point) => {
      this.#newItem(point);
    });
    this.#itemNewPoint = new ItemNewForm(this.#form);
    this.#itemNewPoint.list = this.#listView.list;
    this.#itemNewPoint.onSubmit = this.#onSubmit;
    document.addEventListener('keydown', this.#onKeyDown);
  };

  set onSubmit(onSubmit) {
    this.#onSubmit = (mode, point, button) => {
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

  set onChangeFavorite(onChangeFavorite) {
    this.#onChangeFavorite = onChangeFavorite;
  }

  set onChangeState(onChangeState) {
    this.#onChangeState = onChangeState;
  }

  #onError = () => {
    this.#form.owner.shakeHead();
  };

  newEvent = () => {
    this.#itemNewPoint.point = new Point();
    this.#itemNewPoint.showForm();
    this.#setElement();
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
    this.#listView.element = this.#points.length > 0 || isNew ? ViewMode.list : ViewMode.prompt;
  };

  filterPoints = (mode, sortMode) => {
    this.#points = this.#model.pointsFilter(mode, dayjs());
    this.#points.sort(sortMode);
    this.#fillList();
    this.#listView.prompt = PromptTexts[mode];
    this.#setElement();
  };

  sort(options) {
    this.#points.sort(options);
    this.#fillList();
  }

  #onKeyDown = (evt) => {
    if (this.#form.owner && evt.key === 'Escape') {
      this.#form.owner.hideForm();
    }
  };

  #newItem = (point) => {
    const item = new ItemRollup(
      this.#form,
      point,
      this.#model.destinations[point.destination].name,
      point.offers.length > 0 ? this.#model.getOffers(point.type, point.offers) : false,
    );
    item.routePoint.favoriteButton.getElement().addEventListener('click', () => {
      this.#onChangeFavorite(point);
    });
    item.onSubmit = this.#onSubmit;
    this.#listView.new(item);
  };

  addPoint = (options) => {
    const point = options.point;
    const index = this.#points.list.findIndex((elem) => elem.dateFrom > point.dateFrom);
    this.#newItem(point);
    if (index > -1) {
      const beforeID = this.#points.list[index].id;
      this.#points.list.splice(index, 0, point);
      this.#listView.insert(point.id, beforeID);
    } else {
      this.#points.list.push(point);
    }
    this.#setElement();
    this.hideForm();
  };

  alterPoint = (options) => {
    const point = options.point;
    const alter = options.alter;
    const destination = this.#model.destinations[point.destination].name;
    const offers = alter.includes(FormFields.OFFERS) && point.offers.length > 0 ?
      this.#model.getOffers(point.type, point.offers) : false;
    if (alter.includes(FormFields.DATE_FROM) || alter.includes(FormFields.DATE_TO)) {
      alter.push(FormFields.DURATION);
    }
    if (alter.includes(FormFields.DESTINATION) || alter.includes(FormFields.TYPE)) {
      alter.push(FormFields.TITLE);
    }
    const relocationOptions = this.#points.relocation(point, alter);
    if (relocationOptions) {
      this.#listView.relocation(relocationOptions);
    }
    this.#form.owner.point = point;
    this.#form.owner.routePoint.update(point, alter, destination, offers);
    this.hideForm();
  };

  hideForm() {
    this.#form.owner.hideForm();
  }

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
