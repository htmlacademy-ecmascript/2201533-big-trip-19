import Item from './item';
import RoutePoint from './route-point';
import {SubmitMode} from '../../setings';

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

  showForm = () => {
    super.prepareForm(this);
    this.form.update(this.#point);
    this.form.header.renderRollUp();
    this.routePoint.getElement().replaceWith(this.form.getElement());
    this.form.header.rollUpButton.addEventListener('click', this.hideForm);
  };

  cancel() {
    this.#onSubmit(SubmitMode.DELETE, this.#point);
  }

  submit() {
    this.#onSubmit(SubmitMode.ALTER, this.form.point);
  }

  hideForm = () => {
    this.form.owner = null;
    this.form.default();
    this.form.getElement().replaceWith(this.routePoint.getElement());
  };

  set onSubmit(onSubmit) {
    this.#onSubmit = onSubmit;
  }

  set point(point) {
    this.#point = point;
  }

  get routePoint() {
    return this.#routePoint;
  }
}
