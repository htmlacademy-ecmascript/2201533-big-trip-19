import EditFormView from '../form/edit-form.js';
import dayjs from 'dayjs';
import {createElement, RenderPosition} from '../render.js';
import {FormFields, PromptTexts} from '../../settings';
import ItemRollup from './item-rollup';
import Point from '../../model/point';
import ItemNewForm from './item-new-form';

export default class ListPoints {
  #TEMPLATE = '<ul class="trip-events__list"></ul>';
  #element;
  #model;
  #points;
  #items = {};
  #itemNewPoint;
  #form;
  #onSubmit;
  #onChangeState;
  #list;
  #prompt;
  #onChangeFavorite;

  #onError = () => {
    this.#form.owner.shakeHead();
  };

  newEvent = () => {
    this.#itemNewPoint.point = new Point();
    this.#itemNewPoint.showForm();
    this.#setElement();
  };

  set onChangeFavorite(onChangeFavorite) {
    this.#onChangeFavorite = onChangeFavorite;
  }

  set onChangeState(onChangeState) {
    this.#onChangeState = onChangeState;
  }

  #fillList = () => {
    if (this.#form.owner) {
      this.#form.owner.hideForm();
    }
    this.#list.replaceChildren();
    this.#points.list.forEach((point) => {
      this.#list.append(this.#items[point.id].getElement());
    });
  };

  #setElement = () => {
    const tags = {
      UL: this.#list,
      P: this.#prompt
    };
    const isNew = this.#form.owner instanceof ItemNewForm;
    if (!isNew) {
      this.#onChangeState(this.#points.length === 0);
    }
    const need = this.#points.length > 0 || isNew ? 'UL' : 'P';
    if (this.#element) {
      if (this.#element.tagName === need) {
        return;
      }
      this.#element.replaceWith(tags[need]);
      this.#element = tags[need];
    } else {
      this.#element = tags[need];
    }
  };

  filterPoints = (mode, sortMode) => {
    this.#points = this.#model.pointsFilter(mode, dayjs());
    this.#points.sort(sortMode);
    this.#fillList();
    this.#prompt.textContent = PromptTexts[mode];
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
    this.#items[point.id] = item;
  };

  addPoint = (options) => {
    const point = options.point;
    const index = this.#points.list.findIndex((elem) => elem.dateFrom > point.dateFrom);
    this.#newItem(point);
    if (index > -1) {
      const before = this.#items[this.#points.list[index].id].getElement();
      this.#points.list.splice(index, 0, point);
      before.insertAdjacentElement(RenderPosition.BEFOREBEGIN, this.#items[point.id].getElement());
    } else {
      this.#points.list.push(point);
      this.#list.append(this.#items[point.id].getElement());
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
      const item = this.#items[relocationOptions.delete].getElement();
      item.remove();
      if (relocationOptions.before){
        const before = this.#items[relocationOptions.before].getElement();
        this.#list.insertBefore(item, before);
      }
      else {
        this.#list.append(item);
      }
    }
    this.#form.owner.point = point;
    this.#form.owner.routePoint.update(point, alter, destination, offers);
    this.hideForm();
  };

  hideForm(){
    this.#form.owner.hideForm();
  }

  changeFavorite = (point) => {
    this.#items[point.id].routePoint.favoriteButton.state = point.isFavorite;
  };

  deleteItem = (options) => {
    const id = options.id;
    this.#points.delete(id);
    this.#items[id].getElement().remove();
    delete this.#items[id];
    this.#setElement();
  };

  #blockInterface (block){
    for (let i in this.#items) {
      this.#items[i].disabled = block;
    }
    //this.#form.getElement().disabled = block;
    this.#form.disabled = block;
  }

  set onSubmit(onSubmit) {
    this.#onSubmit = (mode, point, button) => {
      button.textContent = mode.directText;
      this.#blockInterface(true);
      setTimeout(() =>
        onSubmit(mode, point, (options) => {
        button.textContent = mode.backText;
        this.#blockInterface(false);
        this[mode.back](options);
        }, () => {
          button.textContent = mode.backText;
          this.#blockInterface(false);
          this.#onError();
        }), 150000
      )
    };
  }

  set onCancel(onCancel) {
    this.#itemNewPoint.onCancel = onCancel;
  }

  init = () => {
    this.#model.points.list.forEach((point) => {
      this.#newItem(point);
    });
    this.#itemNewPoint = new ItemNewForm(this.#form);
    this.#itemNewPoint.list = this.#list;
    this.#itemNewPoint.onSubmit = this.#onSubmit;
    document.addEventListener('keydown', this.#onKeyDown);
  };

  constructor(model) {
    this.#model = model;
    this.#list = createElement(this.#TEMPLATE);
    this.#prompt = createElement('<p class="trip-events__msg"></p>');
    this.#form = new EditFormView(this.#model.types, this.#model.destinations, this.#model.typeOfOffers);
  }

  getElement = () => this.#element;
}
