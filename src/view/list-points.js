import {createElement} from '../render';
import RoutePoint from './route-point';

export default class ListPoints{
  #TEMPL = '<ul class="trip-events__list"></ul>';
  #element;
  constructor(model) {
    this.#element = createElement(this.#TEMPL);
    model.points().forEach(point=>{
      const li = new RoutePoint(point, model.getDestination(point.destination).name).getElement();
      this.#element.append(li);
      console.log(li);
    });
  }
  getElement = ()=>this.#element;
}
