import {Order} from '../setings';

export default class TripInfo {
  #uniqDestinations;
  #startPoint = undefined;
  #endPoint = undefined;
  #fullPrice = 0;
  #points;
  #model;

  #setStartPoint() {
    this.#points.sort.dateFor();
    this.#startPoint = this.#points.list[0];
  }

  #setEndPoint() {
    this.#points.sort.dateTo(Order.DOWN);
    this.#endPoint = this.#points.list[0];
  }

  #setUniqDestinations() {
    this.#uniqDestinations = new Set(Array.from(this.#points.list, (point) => point.destination));
  }

  init(model) {
    this.#model = model;
    this.#points = model.points;
    this.#setEndPoint();
    this.#setStartPoint();
    this.#setUniqDestinations();
  }

  recalc(model) {
    this.#points.list.forEach((point) => {
      point.recalc(model);
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
  }

  afterAlter(point, alter, delta) {
    if (alter.includes('dateFrom') || alter.includes('dateTo')) {
      this.#checkExtreme(point);
    }
    if (alter.includes('destination')) {
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

  get data() {
    return {
      title: this.#infoTitle(),
      date: this.#infoDate(),
      price: this.#fullPrice
    };
  }
}
