import dayjs from 'dayjs';

export default class Point {
  #fullPrice;
  #newKey = (oldKey) => {
    let newKey = oldKey;
    for (const char of newKey) {
      if (char === char.toUpperCase()) {
        newKey = newKey.replace(char, `_${char.toLowerCase()}`);
      }
    }
    return newKey;
  };

  constructor(
    basePrice = 0,
    dateFrom = dayjs(),
    dateTo = dayjs(),
    destination = -1,
    id = -1,
    isFavorite = false,
    offers = [],
    type = '') {
    this.basePrice = basePrice;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.destination = destination;
    this.id = id;
    this.isFavorite = isFavorite;
    this.offers = offers;
    this.type = type;
  }

  get pricePoint() {
    return this.#fullPrice;
  }

  get localPoint() {
    const pointAs = {};
    for (const [key, value] of Object.entries(this)) {
      if (key !== 'id') {
        pointAs[this.#newKey(key)] = value;
      }
    }
    return pointAs;
  }

  get forAlterPoint() {
    const fields = [];
    for (const [key, value] of Object.entries(this)) {
      if (typeof (value) !== 'function') {
        if (key === 'id') {
          fields.push(`"id": "${JSON.stringify(value)}"`);
        } else {
          fields.push(`${JSON.stringify(this.#newKey(key))}: ${JSON.stringify(value)}`);
        }
      }
    }
    return `{${fields.join(', ')}}`;
  }

  equalField = (point, key) => {
    if (key === 'offers') {
      if (point.offers.length !== this.offers.length) {
        return false;
      }
      return point.offers.every((value) => this.offers.includes(value));
    } else {
      return point[key] === this[key];
    }
  };

  equal = (point) => {
    for (const [key] of Object.entries(this)) {
      if (!this.equalField(point, key)) {
        return false;
      }
    }
    return true;
  };

  alter = (point) => {
    const alter = [];
    for (const [key, value] of Object.entries(point)) {
      if (!this.equalField(point, key)) {
        this[key] = value;
        alter.push(key);
      }
    }
    return alter;
  };

  get copy() {
    if (this.id === -1) {
      return this;
    }
    const point = new Point();
    for (const [key, value] of Object.entries(this)) {
      if (key === 'offers') {
        point.offers = Array.from(this.offers);
      } else {
        point[key] = value;
      }
    }
    return point;
  }

  recalculate(owner) {
    this.#fullPrice = this.offers.reduce((accumulator, currentValue) =>
      accumulator + owner.typeOfOffers[this.type].find((offer) => offer.id === currentValue).price
    , this.basePrice);
  }
}
