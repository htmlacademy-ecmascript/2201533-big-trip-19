import {createElement} from '../render';
import RoutePoint from './route-point';
import EditFormView from './edit-form';

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
  #currentForm = {
    id: -1,
    element: null
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
      ).getElement();
      this.#element.prepend(elem);
    this.#currentForm.id = -1;
    this.#currentForm.element = elem;
  };
  #onRollup = {
    form: (id, element)=>{
      if (this.#currentForm.id === -1){
        if (this.#currentForm.element){
          this.#currentForm.element.remove();
        }
      }
      else{
        this.#onRollup.point(this.#currentForm.id, this.#currentForm.element);
      }
      const point = this.#model.getPoint(id);
      const elem = new EditFormView(
        point,
        this.#model.types(),
        this.#model.getDestination(point.destination),
        this.#model.destinations(),
        this.#model.typeOfOffers(),
        this.#onRollup.point
      ).getElement();
      element.replaceWith(elem);
      this.#currentForm.id = id;
      this.#currentForm.element = elem;
      console.log(this.#currentForm.element);
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
  constructor(model) {
    this.#element = createElement(this.#TEMPL);
    this.#model = model;
    model.points().forEach(point=>{
      const li = new ItemPoint(
        point,
        model.getDestination(point.destination).name,
        point.offers.length > 0 ? model.getOffers(point.type, point.offers): false,
        this.#onRollup.form
        ).getElement();
      this.#element.append(li);
    });
  };
  getElement = ()=>this.#element;
}
