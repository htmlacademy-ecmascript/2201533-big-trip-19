import {createElement} from '../render.js';
import RoutePoint from './route-point.js';
import EditFormView from './edit-form.js';
import dayjs from 'dayjs';

class ItemPoint{
  #TEMPL = '<li class="trip-events__item"></li>';
  #element;
  constructor(id, point, destination, offers, onRollup) {
    this.#element = createElement(this.#TEMPL);
    this.#element.append(new RoutePoint(id, point, destination, offers, onRollup).getElement());
  };
  getElement = ()=>this.#element;
}

export default class ListPoints{
  #TEMPL = '<ul class="trip-events__list"></ul>';
  #element;
  #model;
  #points;
  #currentForm = {
    id: -1,
    element: null,
    form: null,
    reset: function(){
      this.id = -1;
      this.element = null;
      this.form = null;
    },
    isNew: function(){
      return this.id === -1 && this.form;
    },
  };
  #list;
  #prompt;
  #PROMPT_TEXTS = {
    everything: 'Click New Event to create your first point',
    future: 'There are no future events now',
    present: 'There are no present events now',
    past: 'There are no past events now'
  };
  newEvent = ()=>{
    if (this.#currentForm.id > -1){
      this.#onRollup.point(this.#currentForm.id, this.#currentForm.element);
    }
    const point = this.#model.getPoint(-1);

    const form = new EditFormView(
        point,
        this.#model.types(),
        this.#model.getDestination(point.destination),
        this.#model.destinations(),
        this.#model.typeOfOffers(),
      null,
//        this.#formsAction
      );
    form.buttonCancel.addEventListener('click', ()=>{console.log('cancel new form')});
    const elem = form.getElement();
    elem.addEventListener('submit', this.#formsAction.onSubmit);
    this.#list.prepend(elem);
    this.#currentForm.id = -1;
    this.#currentForm.element = elem;
    this.#currentForm.form = form;
    this.#setElement();
    document.addEventListener('keydown', this.#formsAction.onKeyDown);
  };
  #formsAction = {
    onSubmit: (evt)=>{
      evt.preventDefault();
      if (this.#currentForm.isNew()){
        this.#formsAction.onPost(this.#currentForm.form.point);
      }
      else{
        this.#formsAction.onPut(this.#currentForm.form.point);
      }
      this.#formsAction.remove();
      this.#currentForm.reset();
    },
    remove: ()=>{
      document.removeEventListener('keydown', this.#formsAction.onKeyDown);
      if (this.#currentForm.isNew()){
        this.#currentForm.element.remove();
        this.#currentForm.reset();
        this.#formsAction.onClose();
      }
      if (this.#currentForm.id > -1){
        this.#onRollup.point(this.#currentForm.id);
      }
    },
    onKeyDown: (evt)=>{
      if (evt.key === 'Escape'){
        this.#formsAction.remove();
      }
    },
    onCancel: ()=>{

    },
    onClose: ()=>{},
    onPut: ()=>{},
    onDelete: ()=>{},
    onPost: ()=>{}
  };

  set onPost(onPost){
    this.#formsAction.onPost = onPost;
  };
  set onClose(onClose){
    this.#formsAction.onClose = onClose;
  };

  #onRollup = {
    form: (id)=>{
      this.#formsAction.remove();
      const point = this.#points[id];
      const form = new EditFormView(
        point,
        this.#model.types(),
        this.#model.getDestination(point.destination),
        this.#model.destinations(),
        this.#model.typeOfOffers(),
        this.#onRollup.point,
      );
      form.buttonCancel.addEventListener('click', ()=>{console.log('cancel edit form')});
      const elem = form.getElement();
      elem.addEventListener('submit', this.#formsAction.onSubmit);
      point.item.getElement().replaceWith(elem);
      this.#currentForm.id = id;
      this.#currentForm.element = elem;
      this.#currentForm.form = form;
      document.addEventListener('keydown', this.#formsAction.onKeyDown);
    },
    point: ()=>{
      this.#currentForm.form.getElement().replaceWith(this.#points[this.#currentForm.id].item.getElement());
    }
  };
  #fillList = ()=>{
    this.#list.replaceChildren();
    this.#currentForm.reset();
    this.#points.forEach((point, index)=>{
      point.item = new ItemPoint(
        index,
        point,
        this.#model.getDestination(point.destination).name,
        point.offers.length > 0 ? this.#model.getOffers(point.type, point.offers): false,
        this.#onRollup.form
        );
      this.#list.append(point.item.getElement());
    });
  };
  #setElement = ()=>{
    const tags = {
      UL: this.#list,
      P: this.#prompt
    };
    const need = this.#points.length > 0 || this.#currentForm.isNew() ? 'UL': 'P';
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
    this.#points = this.#model.points(mode, dayjs());
    this.#fillList();
    this.#prompt.textContent = this.#PROMPT_TEXTS[mode];
    this.#setElement();
  };
  addPoint = (point)=>{
    const index = this.#points.findIndex(elem=>elem.dateFrom > point.dateFrom);
    point.item = new ItemPoint(
      index,
      point,
      this.#model.getDestination(point.destination).name,
      point.offers.length > 0 ? this.#model.getOffers(point.type, point.offers): false,
      this.#onRollup.form
    );
    if (index > -1){
      const before = this.#points[index].item.getElement();
      this.#points.splice(index, 0, point);
      before.insertAdjacentElement('beforebegin', point.item.getElement());
    }
    else{
      this.#points.push(point);
      this.#list.append(point.item.getElement());
    }
  };
  constructor(model, actions) {
    this.#model = model;
    this.#list = createElement(this.#TEMPL);
    this.#prompt = createElement('<p class="trip-events__msg"></p>');
  };
  getElement = ()=>this.#element;
}
