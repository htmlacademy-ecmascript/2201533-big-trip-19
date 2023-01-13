import {createElement} from '../render';
import FormTypeView from './form-type-view';
import FormDestinationsGroup from './form-destinations-group';
import FormTimeGroup from './form-time-group';
import FormPriceGroup from './form-price-group';
import RollupButton from '../list/rollup-btn';
import {SubmitMode} from '../../settings';

export default class FormHeaderView {
  #element;
  #buttonCancel;
  #buttonSubmit;
  #buttonRollUp;
  #labelType;
  #onChangeType;
  #groupDestination;
  #groupDate;
  #groupPrice;
  #wrapper;
  #destinations;

  constructor(types, destinations) {
    this.#destinations = destinations;
    const typeTitle = (type) => type ? `${type[0].toUpperCase()}${type.slice(1)}` : '';
    this.#element = createElement('<header class="event__header"></header>');

    this.#buttonCancel =
      createElement('<button class="event__reset-btn" type="reset">Cancel</button>');
    this.#buttonSubmit =
      createElement('<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>');
    this.#wrapper = new FormTypeView(types);
    this.#wrapper.onChange = (type) => {
      this.#labelType.textContent = typeTitle(type);
      this.#onChangeType(type);
    };
    this.#element.append(this.#wrapper.getElement());
    this.#groupDestination = new FormDestinationsGroup(destinations.list);
    this.#labelType = this.#groupDestination.labelType;
    this.#element.append(this.#groupDestination.getElement());
    this.#groupDate = new FormTimeGroup();
    this.#element.append(this.#groupDate.getElement());
    this.#groupPrice = new FormPriceGroup();
    this.#element.append(this.#groupPrice.getElement());
    this.#element.append(this.#buttonSubmit);
    this.#element.append(this.#buttonCancel);
    this.#buttonRollUp = new RollupButton();
  }

  update(point) {
    this.#buttonCancel.textContent = SubmitMode.DELETE.backText;
    this.#wrapper.type = point.type;
    this.#groupDestination.type = point.type;
    this.#groupDestination.name = this.#destinations[point.destination].name;
    this.#labelType = this.#groupDestination.labelType;
    this.#groupDate.dateFrom = point.dateFrom;
    this.#groupDate.dateTo = point.dateTo;
    this.#groupPrice.price = point.basePrice;
  }

  default() {
    this.#buttonRollUp.remove();
    this.#wrapper.default();
    this.#groupPrice.price = 0;
    this.#groupDate.default();
    this.#groupDestination.default();
  }

  set onChangeType(onChangeType) {
    this.#onChangeType = onChangeType;
  }

  set onChangeDestination(onChangeDestination) {
    this.#groupDestination.onChange = onChangeDestination;
  }

  set onChangeDate(onChangeDate) {
    this.#groupDate.onChange = onChangeDate;
  }

  set onChangePrice(onChangePrice) {
    this.#groupPrice.onChange = onChangePrice;
  }

  get buttonCancel() {
    return this.#buttonCancel;
  }

  get buttonSubmit() {
    return this.#buttonSubmit;
  }

  get rollUpButton() {
    return this.#buttonRollUp.getElement();
  }

  set disabled(disabled) {
    this.#buttonCancel.disabled = disabled;
    this.#buttonSubmit.disabled = disabled;
    this.#buttonRollUp.getElement().disabled = disabled;
    this.#wrapper.disabled = disabled;
    this.#groupDestination.disabled = disabled;
    this.#groupDate.disabled = disabled;
    this.#groupPrice.disabled = disabled;
  }

  getElement = () => this.#element;

  renderRollUp() {
    this.#buttonRollUp.render(this.#element);
  }
}
