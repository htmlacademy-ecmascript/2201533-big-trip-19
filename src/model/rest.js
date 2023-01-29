import RandomString from './random-string.js';
import {BASE_URL, Endpoints} from '../settings';

export default class Rest {
  #randomString;

  constructor() {
    this.#randomString = new RandomString().value;
  }

  #get = (endpoint, onSuccess, onError) => {
    const url = `${BASE_URL}${endpoint}`;
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${this.#randomString}`
      }
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw {
          status: response.status,
          statusText: response.statusText,
          endpoint: endpoint
        };
      })
      .then(onSuccess)
      .catch(onError);
  };

  DELETE = (id, onSuccess, onError) => {
    const url = `${BASE_URL}${Endpoints.POINTS}/${id}`;
    fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Basic ${this.#randomString}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return true;
        }
        throw `status: ${response.status},
          statusText: ${response.statusText}`;
      })
      .then(onSuccess)
      .catch((msg) => onError(msg));
  };

  PUT = (point, onSuccess, onError) => {
    const url = `${BASE_URL}${Endpoints.POINTS}/${point.id}`;
    fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${this.#randomString}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: point.forAlterPoint
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw `status: ${response.status},
          statusText: ${response.statusText}`;
      })
      .then(onSuccess)
      .catch((msg) => onError(msg));
  };

  POST = (point, onSuccess, onError) => {
    const url = `${BASE_URL}${Endpoints.POINTS}`;
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.#randomString}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(point)
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw `status: ${response.status},
          statusText: ${response.statusText}`;
      })
      .then(onSuccess)
      .catch(onError);
  };

  GET = {
    points: (onSuccess, onError) => {
      this.#get(Endpoints.POINTS, onSuccess, onError);
    },
    destinations: (onSuccess, onError) => {
      this.#get(Endpoints.DESTINATIONS, onSuccess, onError);
    },
    offers: (onSuccess, onError) => {
      this.#get(Endpoints.OFFERS, onSuccess, onError);
    }
  };
}
