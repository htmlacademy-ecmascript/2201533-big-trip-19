import RandomString from './random-string.js';
export default class Rest{
  #BASE_URL = 'https://19.ecmascript.pages.academy/big-trip/';
  #endpoints = {
    points: 'points',
    destinations: 'destinations',
    offers: 'offers'
  };
  #randomString;
  #get = (endpoint, onSuccess, onError)=>{
    const url = `${this.#BASE_URL}${endpoint}`;
    fetch(url,{
      method: 'GET',
      headers: {
        Authorization: `Basic ${this.#randomString}`
      }
    })
      .then((response)=>{
        if (response.ok) {
          return response.json();
        }
        throw `status: ${response.status},
          statusText: ${response.statusText}`;
      })
      .then(onSuccess)
      .catch(onError)
      ;
  };

  PUT = (point, onSuccess, onError)=>{
    const url = `${this.#BASE_URL}${this.#endpoints.points}/:${point.id}`;
    fetch(url,{
      method: 'PUT',
      headers: {
        Authorization: `Basic ${this.#randomString}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(point)
    })
      .then((response)=>{
        if (response.ok) {
          return response.json();
        }
        throw `status: ${response.status},
          statusText: ${response.statusText}`;
      })
      .then(onSuccess)
      .catch(onError)
    ;
  };

  POST = (point, onSuccess, onError)=>{
    const url = `${this.#BASE_URL}${this.#endpoints.points}`;
    fetch(url,{
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.#randomString}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(point)
    })
      .then((response)=>{
        if (response.ok) {
          return response.json();
        }
        throw `status: ${response.status},
          statusText: ${response.statusText}`;
      })
      .then(onSuccess)
      .catch(onError)
    ;
  };

  GET = {
    points: (onSuccess, onError)=>{
      this.#get(this.#endpoints.points, onSuccess, onError)
    },
    destinations: (onSuccess, onError)=>{
      this.#get(this.#endpoints.destinations, onSuccess, onError)
    },
    offers: (onSuccess, onError)=>{
      this.#get(this.#endpoints.offers, onSuccess, onError)
    }
  };

  constructor() {
    this.#randomString = new RandomString().get();
  };
}
