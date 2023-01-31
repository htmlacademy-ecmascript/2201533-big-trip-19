import RandomString from './random-string.js';
import {BASE_URL, ENDPOINTS, Endpoints} from '../settings';

export default class Rest {
  #randomString;

  constructor() {
    this.#randomString = new RandomString().value;
  }

  GET(loader) {
    const init = {
      method: 'GET',
      headers: {
        Authorization: `Basic ${this.#randomString}`
      }
    };
    const fetchers = Array.from(ENDPOINTS, (endpoint) => fetch(`${BASE_URL}${endpoint}`, init)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return {
          error: {
            status: response.status,
            statusText: response.statusText,
            endpoint: endpoint
          }
        };
      })
      .then((r) => {
        if(r.error){
          loader.addError(r.error);
          return false;
        }
        loader[endpoint](r);
        return true;
      })
      .catch((err) => {throw err;})
    );
    return Promise.all(fetchers);
  }

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
}
