import Item from './item';
import RoutePoint from './route-point';
import {SubmitMode} from '../../settings';

export default class ItemRollup extends Item {
  #routePoint;
  #point;
  #onSubmit;

  constructor(form, point, destination, offers) {
    super(form);
    this.#point = point;
    this.#routePoint = new RoutePoint(point, destination, offers);
    this.#routePoint.rollupButton.addEventListener('click', this.showForm);
    this.element.append(this.#routePoint.getElement());
  }

  set onSubmit(onSubmit) {
    this.#onSubmit = onSubmit;
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
    this._form.update(this.#point);
    this._form.header.renderRollUp();
    this.routePoint.getElement().replaceWith(this._form.getElement());
    this._form.header.rollUpButton.addEventListener('click', this.hideForm);
    super.showForm();
  };

  cancel() {
    this.#onSubmit(SubmitMode.DELETE, this.#point, this._form.buttonCancel);
  }

  submit() {
    this.#onSubmit(SubmitMode.ALTER, this._form.point, this._form.buttonSubmit);
  }

  hideForm = () => {
    this._form.owner = null;
    this._form.default();
    this._form.getElement().replaceWith(this.routePoint.getElement());
  };
}
