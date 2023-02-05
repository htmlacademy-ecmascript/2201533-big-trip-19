import Item from './item';
import RoutePoint from '../view/point/route-point';
import {SubmitMode} from '../settings';

export default class ItemRollup extends Item {
  #routePoint;
  #point;
  onSubmit;

  constructor(form, point, destination, offers, onSubmit, onChangeFavorite) {
    super(form);
    this.#point = point;
    this.#routePoint = new RoutePoint(point, destination, offers, this.showForm, () => {onChangeFavorite(point);});
    this.onSubmit = onSubmit;
    this._view.append(this.#routePoint);
  }

  get idPoint() {
    return this.#point.id;
  }

  set point(point) {
    this.#point = point;
  }

  set disabled(disabled) {
    this.#routePoint.disabled = disabled;
  }

  get routePoint() {
    return this.#routePoint;
  }

  showForm = () => {
    super.prepareForm(this);
    super.showForm();
    this._form.update(this.#point.copy, this.hideForm);
    this._view.replace(this._form);
  };

  cancel = () => {
    this.onSubmit(SubmitMode.DELETE, this.#point, this._form.buttonCancel);
  };

  submit = () => {
    this.onSubmit(SubmitMode.ALTER, this._form.point, this._form.buttonSubmit);
  };

  hideForm = () => {
    this._form.owner = null;
    this._form.setDefault();
    this._view.replace(this.routePoint);
  };
}
