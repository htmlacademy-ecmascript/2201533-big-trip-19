import {createElement} from '../render';
import RoutePoint from './route-point';
import EditFormView from './edit-form';
import dayjs from 'dayjs';

class ItemPoint{
  #TEMPL = '<li class="trip-events__item"></li>';
  #element;
  constructor(point, destination, offers, onRollup) {
    this.#element = createElement(this.#TEMPL);
    this.#element.append(new RoutePoint(point, destination, offers, onRollup).getElement());
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
    reset: function(){
      if (this.isNew()){
        this.onClose();
      }
      this.id = -1;
      this.element = null;
    },
    isNew: function(){
      return this.id === -1 && this.element;
    },
    onClose: ()=>{}
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
    const elem = new EditFormView(
        point,
        this.#model.types(),
        this.#model.getDestination(point.destination),
        this.#model.destinations(),
        this.#model.typeOfOffers(),
      null,
        this.#formsAction
      ).getElement();
      this.#list.prepend(elem);
    this.#currentForm.id = -1;
    this.#currentForm.element = elem;
    this.#setElement();
  };
  #formsAction = {
    onSubmit: (evt)=>{
      evt.preventDefault();
      console.log('submit')
    },
    onReset: (evt)=>{
      if (evt.target.tagName !== 'FORM'){
        return;
      }
      if (this.#currentForm.isNew()){
        this.#currentForm.element.remove();
        this.#currentForm.reset();
      }
      if (this.#currentForm.id > -1){
        //Это вообще-то Delete со всеми вытекающими
        this.#onRollup.point(this.#currentForm.id, this.#currentForm.element);
      }
    }
  };
  #onRollup = {
    form: (id, element)=>{
      // if (this.#currentForm.isNew()){
      //   this.#currentForm.element.remove();
      //   this.#currentForm.reset();
      // }
      // if (this.#currentForm.id > -1){
      //   this.#onRollup.point(this.#currentForm.id, this.#currentForm.element);
      // }
      this.#formsAction.onReset();
      const point = this.#model.getPoint(id);
      const elem = new EditFormView(
        point,
        this.#model.types(),
        this.#model.getDestination(point.destination),
        this.#model.destinations(),
        this.#model.typeOfOffers(),
        this.#onRollup.point,
        this.#formsAction
      ).getElement();
      element.replaceWith(elem);
      this.#currentForm.id = id;
      this.#currentForm.element = elem;
    },
    point: (id, element)=>{
      const point = this.#model.getPoint(id);
      const elem = new RoutePoint(
        point,
        this.#model.getDestination(point.destination).name,
        point.offers.length > 0 ? this.#model.getOffers(point.type, point.offers): false,
        this.#onRollup.form
      ).getElement();
      element.replaceWith(elem);
    }
  };
  #fillList = ()=>{
    this.#list.replaceChildren();
    this.#currentForm.reset();
    this.#points.forEach(point=>{
      const li = new ItemPoint(
        point,
        this.#model.getDestination(point.destination).name,
        point.offers.length > 0 ? this.#model.getOffers(point.type, point.offers): false,
        this.#onRollup.form
        ).getElement();
      this.#list.append(li);
    });
  };
  #setElement = ()=>{
    const tags = {
      UL: this.#list,
      P: this.#prompt
    };
    const need = this.#points.length > 0 || this.#currentForm.isNew() ? 'UL': 'P';
    if (this.#element){
      console.log(this.#element.tagName);
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
  constructor(model, actions) {
    this.#model = model;
    this.#list = createElement(this.#TEMPL);
    this.#prompt = createElement('<p class="trip-events__msg"></p>');
    this.#currentForm.onClose = actions.onCloseAddForm;
  };
  getElement = ()=>this.#element;
}
