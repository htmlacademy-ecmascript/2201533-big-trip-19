import {newDestinationFromJson} from './from-json';

export default class Destinations {
  #list = [];

  get list() {
    return this.#list;
  }

  fillJson = (json) => {
    json.forEach((jsonObject) => {
      const destination = newDestinationFromJson(jsonObject);
      this.#list.push(destination);
      this[destination.id] = destination;
    });
  };
}
