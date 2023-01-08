import {newDestination} from './from-json';
import Destination from './destination';

export default class Destinations {
  #list = [];

  fillJson(json) {
    json.forEach((destination) => {
      const dest = newDestination(destination);
      this.#list.push(dest);
      this[dest.id] = dest;
    });
  }

  '-1' = new Destination();

  get list() {
    return this.#list;
  }
}
