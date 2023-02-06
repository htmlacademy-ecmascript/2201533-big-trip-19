import dayjs from 'dayjs';

export default class Point {
  #fullPrice = 0;
  basePrice = 0;
  dateFrom;
  dateTo;
  destination = -1;
  id = -1;
  isFavorite = false;
  offers = [];
  type = '';

  constructor(basePrice, dateFrom , dateTo, destination , id, isFavorite, offers, type) {
    this.basePrice = basePrice || this.basePrice;
    this.dateFrom = dateFrom || dayjs();
    this.dateTo = dateTo || dayjs();
    this.destination = destination || destination === 0 ? destination : this.destination;
    this.id = id || id === 0 ? id : this.id;
    this.isFavorite = isFavorite || false;
    this.offers = offers || [];
    this.type = type || '';
  }

  get entries() {
    return Object.entries(this).filter((value) => typeof(value[1]) !== 'function');
  }

  get fullPrice() {
    return this.#fullPrice;
  }

  set fullPrice(price) {
    this.#fullPrice = price;
  }

  get forPOST() {
    const pointAsJson = {};
    this.entries.forEach(([key, value]) => {
      if (key !== 'id') {
        pointAsJson[this.#getNewKey(key)] = value;
      }
    });
    return pointAsJson;
  }

  get jsonForPUT() {
    const fields = [];
    this.entries.forEach(([key, value]) => {
      if (key === 'id') {
        fields.push(`"id": "${JSON.stringify(value)}"`);
      } else {
        fields.push(`${JSON.stringify(this.#getNewKey(key))}: ${JSON.stringify(value)}`);
      }
    });
    return `{${fields.join(', ')}}`;
  }

  get copy() {
    if (this.id === -1) {
      return this;
    }
    const point = new Point();
    this.entries.forEach(([key, value]) => {
      if (key === 'offers') {
        point.offers = Array.from(this.offers);
      } else {
        point[key] = value;
      }
    });
    return point;
  }

  recalculate = (owner) => {
    this.#fullPrice = this.offers.reduce((accumulator, currentValue) =>
      accumulator + owner.typeOfOffers[this.type].find((offer) => offer.id === currentValue).price
    , this.basePrice);
  };

  #getNewKey = (oldKey) => {
    let newKey = oldKey;
    [...newKey].forEach((char) => {
      if (char === char.toUpperCase()) {
        newKey = newKey.replace(char, `_${char.toLowerCase()}`);
      }
    });
    return newKey;
  };

  isEqualField = (point, key) => {
    if (key === 'offers') {
      if (point.offers.length !== this.offers.length) {
        return false;
      }
      return point.offers.every((value) => this.offers.includes(value));
    }
    return point[key] === this[key];
  };

  isEqual = (point) => Object.keys(this).every((key) => this.isEqualField(point, key));

  alter = (point) => {
    const changes = new Set();
    point.entries.forEach(([key, value]) => {
      if (!this.isEqualField(point, key)) {
        this[key] = value;
        changes.add(key);
      }
    });
    return changes;
  };
}
