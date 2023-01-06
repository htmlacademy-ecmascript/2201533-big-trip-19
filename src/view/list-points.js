import {createElement} from '../render.js';
import EditFormView from './edit-form.js';
import dayjs from 'dayjs';
import {RenderPosition} from '../render.js';
import {ACTIONS, PROMPT_TEXTS} from '../setings';
import ItemRollup from './item-rollup';
import Point from '../model/point';
import ItemNewForm from './item-new-form';

export default class ListPoints{
  #TEMPL = '<ul class="trip-events__list"></ul>';
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
  #onChangeFavourite = ()=>{};

  newEvent = ()=>{
    this.#itemNewPoint.point = new Point();
    this.#itemNewPoint.showForm();
    this.#setElement();
  };

  set onChangeFavourite(onChangeFavourite){
    this.#onChangeFavourite = onChangeFavourite;
  };

  set onChangeState(onChangeState){
    this.#onChangeState = onChangeState;
  };

  #fillList = ()=>{
    if (this.#form.owner){
      this.#form.owner.hideForm();
    }
    this.#list.replaceChildren();
    this.#points.list.forEach((point)=>{
      this.#list.append(this.#items[point.id].getElement());
    });
  };

  #setElement = ()=>{
    const tags = {
      UL: this.#list,
      P: this.#prompt
    };
    const isNew = this.#form.owner instanceof ItemNewForm;
    if (!isNew){
      this.#onChangeState(this.#points.length === 0);
    }
    const need = this.#points.length > 0 || isNew ? 'UL': 'P';
    if (this.#element){
      if (this.#element.tagName === need){
        return;
      }
      this.#element.replaceWith(tags[need]);
      this.#element = tags[need];
    }
    else{
      this.#element = tags[need];
    }
  };

  filterPoints = (mode)=>{
    this.#points = this.#model.pointsFilter(mode, dayjs());
    this.#fillList();
    this.#prompt.textContent = PROMPT_TEXTS[mode];
    this.#setElement();
  };

  sort(mode, order){
    this.#points.sort[mode](order);
    this.#fillList();
  };

  #onKeyDown = (evt) => {
    if (this.#form.owner && evt.key === 'Escape'){
      this.#form.owner.hideForm();
    }
  };

  #newItem = (point)=>{
    const item = new ItemRollup(
      this.#form,
      point,
      this.#model.destinations[point.destination].name,
      point.offers.length > 0 ? this.#model.getOffers(point.type, point.offers): false,
    );
    item.routePoint.favouriteButton.getElement().addEventListener('click', ()=>{
      this.#onChangeFavourite(point)
    });
    item.onSubmit = this.#onSubmit;
    this.#items[point.id] = item;
  };

  addPoint = (options) => {
    const point = options.point;
    const index = this.#points.list.findIndex((elem) => elem.dateFrom > point.dateFrom);
    this.#newItem(point);
    if (index > -1){
      const before = this.#items[this.#points.list[index].id].getElement();
      this.#points.list.splice(index, 0, point);
      before.insertAdjacentElement(RenderPosition.BEFOREBEGIN, this.#items[point.id].getElement());
    }
    else{
      this.#points.list.push(point);
      this.#list.append(this.#items[point.id].getElement());
    }
    this.#setElement();
    this.#form.owner.hideForm();
  };

  alterPoint = (options) => {
    const point = options.point;
    const alter = options.alter;
    const destination = this.#model.destinations[point.destination].name;
    const offers = alter.includes('offers') && point.offers.length > 0 ?
      this.#model.getOffers(point.type, point.offers): false;
    if (alter.includes('dateFor') || alter.includes('dateTo')){
      alter.push('duration');
    }
    if (alter.includes('destination') || alter.includes('type')){
      alter.push('title');
    }
    this.#form.owner.point = point;
    this.#form.owner.routePoint.update(point, alter, destination, offers);
    this.#form.owner.hideForm();
  };

  changeFavourite = (point) => {
    this.#items[point.id].routePoint.favouriteButton.state = point.isFavorite;
  };

  deleteItem = (options) => {
    const id = options.id;
    this.#points.delete(id);
    this.#items[id].getElement().remove();
    delete this.#items[id];
    this.#setElement();
  };

  set onSubmit(onSubmit){
    this.#onSubmit = (mode, point) => {
      onSubmit(mode, point, this[ACTIONS[mode].back], console.log)
    };
  };

  set onCancel(onCancel){
    this.#itemNewPoint.onCancel = onCancel;
  };

  init = () => {
    this.#model.points.list.forEach(point => {
      this.#newItem(point);
    });
    this.#itemNewPoint = new ItemNewForm(this.#form);
    this.#itemNewPoint.list = this.#list;
    this.#itemNewPoint.onSubmit = this.#onSubmit;
    document.addEventListener('keydown', this.#onKeyDown);
  };

  constructor(model) {
    this.#model = model;
    this.#list = createElement(this.#TEMPL);
    this.#prompt = createElement('<p class="trip-events__msg"></p>');
    this.#form = new EditFormView(this.#model.types(), this.#model.destinations, this.#model.typeOfOffers);
  };

  getElement = ()=>this.#element;
}
