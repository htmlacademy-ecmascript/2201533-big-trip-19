import {newDestination} from './from-json';

export default class Destinations {
  #list = [];

  get list() {
    return this.#list;
  }

  fillJson(json) {
    json.forEach((destination) => {
      const dest = newDestination(destination);
      this.#list.push(dest);
      this[dest.id] = dest;
    });
  }
}
