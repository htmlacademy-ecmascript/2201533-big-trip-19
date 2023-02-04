import AbstractView from '../../framework/view/abstract-view';

export default class RollupButton extends AbstractView{
  #onRollUp;

  constructor(onRollUp) {
    super();
    this.#onRollUp = onRollUp;
    this.element.addEventListener('click', () => {
      this.#onRollUp();
    });
  }

  get template() {
    return `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`;
  }

  set onRollUp(onRollUp){
    this.#onRollUp = onRollUp;
  }

  render = (parent) => {
    parent.append(this.element);
  };

  remove = () => {
    this.element.remove();
  };
}
