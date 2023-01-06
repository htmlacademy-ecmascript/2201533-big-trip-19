import Item from './item';

export default class ItemNewForm extends Item{
  list;
  #point;
  #onSubmit;
  #onCancel;
  constructor(form){
    super(form);
    this.element.append(this.form.getElement());
  };

  showForm = () => {
    super.prepareForm(this);
    this.form.point = this.#point;
    this.form.buttonCancel.textContent = 'Cancel';
    this.element.append(this.form.getElement());
    this.list.prepend(this.element);
  };

  cancel(){
    this.hideForm();
  };

  submit(){
    this.#onSubmit('add', this.form.point);
  };

  set onCancel(onCancel){
    this.#onCancel = onCancel;
  }

  set onSubmit(onSubmit){
    this.#onSubmit = onSubmit;
  };

  hideForm = () => {
    this.element.remove();
    this.form.default();
    this.form.owner = null;
    this.#onCancel();
  };

  set point(point){
    this.#point = point;
  }
}
