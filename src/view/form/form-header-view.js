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
  #typeTitle = (type) => type ? `${type[0].toUpperCase()}${type.slice(1)}` : '';

  constructor(types, destinations) {
    super();
    this.#destinations = destinations;
    this.#wrapper = new HeaderTypeView(types);
    this.#groupDestination = new FormDestinationsView(destinations.list);
    this.init();
  }

  init = () => {
    super._createElement();
    this.#labelType = this.#groupDestination.labelType;
    this.#groupDate = new HeaderTimeGroup();
    this.#groupPrice = new HeaderPriceGroup();
    this.#buttonRollUp = new RollupButton();
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

  initNew = () => {
    this.#groupDate.setDefault();
  };

  update = (point, onRollUp) => {
    this.#buttonCancel.textContent = SubmitMode.DELETE.backText;
    this.#wrapper.type = point.type;
    this.#groupDestination.type = point.type;
    this.#groupDestination.name = this.#destinations[point.destination].name;
    this.#labelType = this.#groupDestination.labelType;
    this.#groupDate.dateFrom = point.dateFrom;
    this.#groupDate.dateTo = point.dateTo;
    this.#groupPrice.price = point.basePrice;
    this.#buttonRollUp.render(this.element);
    this.#buttonRollUp.onRollUp = onRollUp;
  };

  setDefault() {
    this.#buttonRollUp.remove();
    this.#wrapper.setDefault();
    this.#groupPrice.price = 0;
    this.#groupDate.setDefault();
    this.#groupDestination.setDefault();
  }

  get buttonCancel() {
    return this.#buttonCancel;
  }

  get buttonSubmit() {
    return this.#buttonSubmit;
  }

  get template() {
    return '<header class="event__header"></header>';
  }

  set callbacks(callbacks) {
    this.#wrapper.onChange = (type) => {
      this.#labelType.textContent = this.#typeTitle(type);
      callbacks.onChangeType(type);
    };
    this.#groupDestination.onChange = callbacks.onChangeDestination;
    this.#groupDate.onChange = callbacks.onChangeDate;
    this.#groupPrice.onChange = callbacks.onChangePrice;
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
}
