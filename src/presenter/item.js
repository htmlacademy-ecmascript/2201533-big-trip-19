import ItemView from '../view/list/item-view';

export default class Item {
  _form;
  #view;
  constructor(form) {
    this._form = form;
    this.#view = new ItemView();
  }

  prepareForm(newOwner) {
    if (this._form.owner && this._form.owner !== newOwner) {
      this._form.owner.hideForm();
    }
    this._form.owner = newOwner;
  }

  showForm() {
    this._form.submit = this.submit;
    this._form.cancel = this.cancel;
  }

  cancel = () => {};

  submit = () => {};

  get element() {
    return this.#view.element;
  }
}
