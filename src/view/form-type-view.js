import {createElement} from '../render';
import {ICONS} from '../setings';

export default class FormTypeView{
  #onChange;
  #element;
  #iconType;
  #items = {};
  #type;
  constructor (types){
    const typeTitle = type => type ? `${type[0].toUpperCase()}${type.slice(1)}` : '';
    this.#element = createElement(
    `<div class="event__type-wrapper">
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle" type="checkbox">
    </div>
    `);
    const buttonType = createElement(
    `<label class="event__type  event__type-btn" for="event-type-toggle">
        <span class="visually-hidden">Choose event type</span>
      </label>
    `);
    this.#iconType = createElement(`<img class="event__type-icon" width="17" height="17"
          src="#" alt="Event type icon">`);
    buttonType.append(this.#iconType);
    const listTypes = createElement(`<div class="event__type-list"></div>`);
    const fieldSet = createElement(
      `<fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
      </fieldset>`);
    types.forEach(type => {
      this.#items[type] = createElement(
      `<input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio"
              name="event-type" value="${type}">`)

      const container = createElement(
        `<div class="event__type-item">
          <label class="event__type-label  event__type-label--${type}" for="event-type-${type}">${typeTitle(type)}</label>
        </div>`
      );
      container.prepend(this.#items[type]);
      fieldSet.append(container);
    });

    fieldSet.addEventListener('change', (evt)=>{
      this.#type = evt.target.value;
      listTypes.style.display = 'none';
      this.#iconType.src = `${ICONS.PATH}${this.#type}${ICONS.EXT}`;
      this.#onChange(this.#type);
    });

    buttonType.addEventListener('click', ()=>{
      const states = {
        block: 'none',
        none: 'block',
        '': 'block'
      };
      listTypes.style.display = states[listTypes.style.display];
    });

    listTypes.append(fieldSet);
    this.#element.append(buttonType);
    this.#element.append(listTypes);
  };

  default(){
    if (this.#type){
      this.#items[this.#type].checked = false;
      this.#iconType.src = `#`;
      this.#type = '';
    }
  };

  set type(type){
    this.#type = type;
    this.#iconType.src = `${ICONS.PATH}${type}${ICONS.EXT}`;
    this.#items[type].checked = true;
  };

  set onChange(onChange){
    this.#onChange = onChange;
  }

   getElement = ()=>this.#element;
};
