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
  newEvent = ()=>{
    console.log('Add event');
    const point = this.#model.getPoint(null);
    console.log(point);
    const elem = new EditFormView(
        point,
        this.#model.types(),
        this.#model.getDestination(point.destination),
        this.#model.destinations(),
        this.#model.typeOfOffers(),
      null,
      ).getElement();
      this.#element.prepend(elem);
  };
  #onRollup = {
    form: (id, element)=>{
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
    },
    point: (id, element)=>{
      const point = this.#model.getPoint(id);
      console.log(id);
      console.log(point);
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
