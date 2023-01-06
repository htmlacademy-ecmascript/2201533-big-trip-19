import {createElement} from '../render';

export default class Item{
  #TEMPL = '<li class="trip-events__item"></li>';
  element;
  form;
  constructor(form) {
    this.form = form;
    this.element = createElement(this.#TEMPL);
  };

  prepareForm(newOwner){
    if (this.form.owner && this.form.owner !== newOwner ){
      this.form.owner.hideForm();
    }
    this.form.owner = newOwner;
  };

  cancel(){};

  submit(){};

  getElement = ()=>this.element;
}
