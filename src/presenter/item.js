// import {createElement} from '../view/render';
// import Shaker from '../view/shaker';
// import {SHAKING_PARAM} from '../settings';
import ItemView from '../view/list/item-view';

export default class Item {
  //#TEMPLATE = '<li class="trip-events__item"></li>';
  //#shaker;
  //element;
  _form;
  _marginLeft;
  _marginRight;
  #view;
  constructor(form) {
    this._form = form;
    this.#view = new ItemView();
    //this.#shaker = new Shaker(SHAKING_PARAM);
    //this.#shaker.onStep = this.#stepShaking;
    //this.#shaker.onStop = this.#stopShaking;
  }

  //getElement = () => this.element;

  prepareForm(newOwner) {
    if (this._form.owner && this._form.owner !== newOwner) {
      this._form.owner.hideForm();
    }
    this._form.owner = newOwner;
  }

  showForm() {
    this._form.submit = this.submit;
    this._form.cancel = this.cancel;
    //   this._marginLeft = parseInt(
  //     window.getComputedStyle(this._form.getElement()).marginLeft.replace('px', ''), 10);
  //   this._marginRight = parseInt(
  //     window.getComputedStyle(this._form.getElement()).marginRight.replace('px', ''), 10);
  }

  // #stepShaking = (ordinate) => {
  //   this._form.marginLeft = this._marginLeft + ordinate;
  //   this._form.marginRight = this._marginRight - ordinate;
  // };
  //
  // #stopShaking = () => {
  //   this._form.clearStyle();
  // };

  cancel = () => {};

  submit = () => {};

  get element() {
    return this.#view.element;
  }
  // shakeHead() {
  //   this.#shaker.start();
  // }
}
