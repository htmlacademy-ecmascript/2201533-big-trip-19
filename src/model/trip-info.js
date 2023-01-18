import {FormFields} from '../settings';

export default class TripInfo {
  #uniqDestinations = null;
  #startPoint = undefined;
  #endPoint = undefined;
  #fullPrice = 0;
  #points;
  #model;

  init(model) {
    this.#model = model;
    this.#points = model.points;
    if (this.#points.length){
      this.#setParams();
    }
  }

  #setParams() {
    this.#setEndPoint();
    this.#setStartPoint();
    this.#setUniqDestinations();
  }

  get data() {
    if (this.#points.length === 0) {
      return false;
    }
    return {
      title: this.#infoTitle(),
      date: this.#infoDate(),
      price: this.#fullPrice
    };
  }

  #setStartPoint() {
    this.#startPoint = this.#points.start;
  }

  #setEndPoint() {
    this.#endPoint = this.#points.end;
  }

  #setUniqDestinations() {
    this.#uniqDestinations = new Set(Array.from(this.#points.list, (point) => point.destination));
  }

  recalculate(model) {
    this.#points.list.forEach((point) => {
      point.recalculate(model);
      this.#fullPrice += point.pricePoint;
    });
  }

  #checkExtreme(point) {
    if (point.dateFrom < this.#startPoint.dateFrom) {
      this.#startPoint.dateFrom = point;
    }
    if (point.dateTo > this.#endPoint.dateFrom) {
      this.#endPoint = point;
    }
  }

  afterDelete(point) {
    if (this.#points.length === 0) {
      this.#uniqDestinations = null;
      this.#startPoint = undefined;
      this.#endPoint = undefined;
      this.#fullPrice = 0;
      return;
    }
    if (this.#startPoint.id === point.id) {
      this.#setStartPoint();
    }
    if (this.#endPoint.id === point.id) {
      this.#setEndPoint();
    }
    this.#setUniqDestinations();
    this.#fullPrice -= point.pricePoint;
  }

  afterAdd(point) {
    this.#fullPrice += point.pricePoint;
    if (!this.#startPoint){
      this.#setParams();
    }
  }

  afterAlter(point, alter, delta) {
    if (alter.includes(FormFields.DATE_FROM) || alter.includes(FormFields.DATE_TO)) {
      this.#checkExtreme(point);
    }
    if (alter.includes(FormFields.DESTINATION)) {
      this.#setUniqDestinations();
    }
    this.#fullPrice += delta;
  }

  #infoTitle() {
    const destinations = new Set(this.#uniqDestinations);
    destinations.delete(this.#startPoint.destination);
    destinations.delete(this.#endPoint.destination);
    return `${this.#model.destinations[this.#startPoint.destination].name} — ${
      destinations.size === 1 ? this.#model.destinations[destinations.values().next().value] : '. . .'} — ${
      this.#model.destinations[this.#endPoint.destination].name}`;
  }

  #infoDate() {
    const start = this.#startPoint.dateFrom;
    const end = this.#endPoint.dateTo;
    if (start.year() !== end.year()) {
      // eslint-disable-next-line no-irregular-whitespace
      return `${start.format('YYYY MMM DD')} — ${end.format('YYYY MMM DD')}`;
    }
    if (start.month() !== end.month()) {
      // eslint-disable-next-line no-irregular-whitespace
      return `${start.format('MMM DD')} — ${end.format('MMM DD')}`;
    }
    // eslint-disable-next-line no-irregular-whitespace
    return `${start.format('MMM DD')} — ${end.format('DD')}`;
  }
}
