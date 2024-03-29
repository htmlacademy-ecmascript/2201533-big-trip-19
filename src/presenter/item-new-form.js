import Item from './item';
import {SubmitMode} from '../settings';

export default class ItemNewForm extends Item {
  #point;
  #onSubmit;
  #onCancel;
  list;

  constructor(form) {
    super(form);
    this.element.append(this._form.element);
  }

  set onCancel(onCancel) {
    this.#onCancel = onCancel;
  }

  set onSubmit(onSubmit) {
    this.#onSubmit = onSubmit;
  }

  set point(point) {
    this.#point = point;
  }

  showForm = () => {
    super.prepareForm(this);
    super.showForm();
    this._form.initNew(this.#point);
    this.element.append(this._form.element);
    this.list.element.prepend(this.element);
  };

  cancel = () => {
    this.hideForm();
  };

  submit = () => {
    this.#onSubmit(SubmitMode.ADD, this._form.point, this._form.buttonSubmit);
  };

  hideForm = () => {
    this.element.remove();
    this._form.setDefault();
    this._form.owner = null;
    this.#onCancel();
  };
}
