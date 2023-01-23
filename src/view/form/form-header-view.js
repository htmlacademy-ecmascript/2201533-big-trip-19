import {createElement} from '../../framework/render';
import HeaderTypeView from './header/header-type-view';
import FormDestinationsView from './header/header-destinations-view';
import HeaderTimeGroup from './header/header-time-group';
import HeaderPriceGroup from './header/header-price-group';
import RollupButton from '../point/rollup-btn';
import {SubmitMode} from '../../settings';
import AbstractTrickyView from '../abstract-tricky-view';

export default class FormHeaderView extends AbstractTrickyView{
  #buttonCancel;
  #buttonSubmit;
  #buttonRollUp;
  #labelType;
  #groupDestination;
  #groupDate;
  #groupPrice;
  #wrapper;
  #destinations;

  constructor(types, destinations) {
    super();
    this.#destinations = destinations;
    this.#wrapper = new HeaderTypeView(types);
    this.#groupDestination = new FormDestinationsView(destinations.list);
    this.#labelType = this.#groupDestination.labelType;
    this.#groupDate = new HeaderTimeGroup();
    this.#groupPrice = new HeaderPriceGroup();
    this.#buttonRollUp = new RollupButton();
  }

  _createElement = () => {
    super._createElement();
    this.#buttonCancel =
      createElement('<button class="event__reset-btn" type="reset">Cancel</button>');
    this.#buttonSubmit =
      createElement('<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>');
    this.element.append(this.#wrapper.element);
    this.element.append(this.#groupDestination.element);
    this.element.append(this.#groupDate.element);
    this.element.append(this.#groupPrice.element);
    this.element.append(this.#buttonSubmit);
    this.element.append(this.#buttonCancel);
  };

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

  get buttonCancel() {
    return this.#buttonCancel;
  }

  get buttonSubmit() {
    return this.#buttonSubmit;
  }

  set callBacks(callBacks) {
    this.#wrapper.onChange = (type) => {
      this.#labelType.textContent = this.#typeTitle(type);
      callBacks.onChangeType(type);
    };
    this.#groupDestination.onChange = callBacks.onChangeDestination;
    this.#groupDate.onChange = callBacks.onChangeDate;
    this.#groupPrice.onChange = callBacks.onChangePrice;
  }

  set disabled(disabled) {
    this.#buttonCancel.disabled = disabled;
    this.#buttonSubmit.disabled = disabled;
    this.#buttonRollUp.element.disabled = disabled;
    this.#wrapper.disabled = disabled;
    this.#groupDestination.disabled = disabled;
    this.#groupDate.disabled = disabled;
    this.#groupPrice.disabled = disabled;
  }

  #typeTitle = (type) => type ? `${type[0].toUpperCase()}${type.slice(1)}` : '';

  renderRollUp = (onRollUp) => {
    this.#buttonRollUp.render(this.element);
    this.#buttonRollUp.onRollUp = onRollUp;
  };

  get template() {
    return '<header class="event__header"></header>';
  }
}
