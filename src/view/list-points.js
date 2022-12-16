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
  #onRollup = {
    form: (id, element)=>{
      const elem = new EditFormView(
        this.#model.getPoint(id),
        this.#model.types(),
        this.#model.destinations()
      )
      console.log(`${id}: ${element.tagName}`);
    },
    point: (id, element)=>{

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
