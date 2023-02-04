import {FormFields} from '../settings';

export default class TripInfo {
  #uniqDestinations = null;
  #startPoint = null;
  #endPoint = null;
  #fullPrice = 0;
  #points;
  #model;

  constructor(model) {
    this.#model = model;
    this.#points = model.points;
  }

  get data() {
    if (this.#points.length === 0) {
      return false;
    }
    return {
      title: this.infoTitle,
      date: this.infoDate,
      price: this.#fullPrice
    };
  }

  get infoTitle() {
    const destinations = new Set(this.#uniqDestinations);
    destinations.delete(this.#startPoint.destination);
    destinations.delete(this.#endPoint.destination);
    return `${this.#model.destinations[this.#startPoint.destination].name} — ${
      destinations.size === 1 ? this.#model.destinations[destinations.values().next().value] : '. . .'} — ${
      this.#model.destinations[this.#endPoint.destination].name}`;
  }

  get infoDate() {
    const start = this.#startPoint.dateFrom;
    const end = this.#endPoint.dateTo;
    if (start.year() !== end.year()) {
      return `${start.format('YYYY MMM DD')} — ${end.format('YYYY MMM DD')}`;
    }
    if (start.month() !== end.month()) {
      return `${start.format('MMM DD')} — ${end.format('MMM DD')}`;
    }
    return `${start.format('MMM DD')} — ${end.format('DD')}`;
  }

  setParams = () => {
    this.#setEndPoint();
    this.#setStartPoint();
    this.#setUniqDestinations();
  };

  #setStartPoint = () => {
    this.#startPoint = this.#points.start;
  };

  #setEndPoint = () => {
    this.#endPoint = this.#points.end;
  };

  #setUniqDestinations = () => {
    this.#uniqDestinations = new Set(Array.from(this.#points.list, (point) => point.destination));
  };

  recalculate = () => {
    this.#points.list.forEach((point) => {
      point.recalculate(this.#model);
      this.#fullPrice += point.fullPrice;
    });
  };

  #checkExtreme = (point) => {
    if (point.dateFrom < this.#startPoint.dateFrom) {
      this.#startPoint = point;
    }
    if (point.dateFrom > this.#endPoint.dateFrom) {
      this.#endPoint = point;
    }
  };

  doAfterDeleting = (point) => {
    if (this.#points.length === 0) {
      this.#uniqDestinations = null;
      this.#startPoint = null;
      this.#endPoint = null;
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
    this.#fullPrice -= point.fullPrice;
  };

  doAfterAdding = (point) => {
    this.#fullPrice += point.fullPrice;
    if (!this.#startPoint){
      this.setParams();
    }else {
      this.#checkExtreme(point);
      this.#setUniqDestinations();
    }
  };

  doAfterAlterations = (point, alter, delta) => {
    if (alter.includes(FormFields.DATE_FROM) || alter.includes(FormFields.DATE_TO)) {
      this.#checkExtreme(point);
    }
    if (alter.includes(FormFields.DESTINATION)) {
      this.#setUniqDestinations();
    }
    this.#fullPrice += delta;
  };
}
