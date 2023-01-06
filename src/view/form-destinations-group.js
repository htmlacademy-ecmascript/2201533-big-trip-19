import {createElement} from '../render';

export default class FormDestinationsGroup{
  #labelType;
  #onChange;
  #destination;
  #element;
  #inputDestination;
  constructor(destinations){
    this.#element = createElement(
      `<div class="event__field-group  event__field-group--destination">
      <datalist id="destination-list">
        ${Array.from(destinations, (elem)=>`<option value="${elem.name}"></option>`).join('')}
      </datalist>
    </div>`
    );
    this.#labelType = createElement(
      `<label class="event__label  event__type-output" for="event-destination"></label>`);

    this.#inputDestination = createElement(
      `<input class="event__input  event__input--destination" id="event-destination" type="text"
        name="event-destination" value="" list="destination-list">
    `);
    this.#inputDestination.addEventListener('change', (evt)=>{
      const destination = destinations.find(element=>element.name === evt.target.value);
      if (destination){
        this.#onChange(destination);
      }
    });
    this.#element.prepend(this.#inputDestination);
    this.#element.prepend(this.#labelType);
  };

  default(){
    this.name = '';
    this.#labelType.textContent = '';
  };

  get destination(){
    return this.#destination;
  };

  set onChange(onChange){
    this.#onChange = onChange;
  };

  get labelType(){
    return this.#labelType;
  };

  set name(name){
    this.#inputDestination.value = name;
  };

  set type(type){
    this.#labelType.textContent = `${type[0].toUpperCase()}${type.slice(1)}`;
  };

  getElement = ()=>this.#element;
};
