import Item from './item';
import RoutePoint from '../view/point/route-point';
import {SubmitMode} from '../settings';

export default class ItemRollup extends Item {
  #routePoint;
  #point;
  onSubmit;

  constructor(form, point, destination, offers) {
    super(form);
    this.#point = point;
    this.#routePoint = new RoutePoint(point, destination, offers);
    this.#routePoint.rollupButton.onRollUp = this.showForm;
    this.element.append(this.#routePoint.element);
  }

  // set onSubmit(onSubmit) {
  //   this.#onSubmit = onSubmit;
  // }

  get idPoint() {
    return this.#point.id;
  }

  set point(point) {
    this.#point = point;
  }

  set disabled(disabled) {
    this.#routePoint.rollupButton.disabled = disabled;
  }

  get routePoint() {
    return this.#routePoint;
  }

  showForm = () => {
    super.prepareForm(this);
    super.showForm();
    this._form.update(this.#point.copy);
    this._form.header.renderRollUp(this.hideForm);
    this.routePoint.element.replaceWith(this._form.element);
  };

  cancel = () => {
    this.onSubmit(SubmitMode.DELETE, this.#point, this._form.buttonCancel);
  };

  submit = () => {
    this.onSubmit(SubmitMode.ALTER, this._form.point, this._form.buttonSubmit);
  };

  hideForm = () => {
    this._form.owner = null;
    this._form.default();
    this._form.element.replaceWith(this.routePoint.element);
  };
}
