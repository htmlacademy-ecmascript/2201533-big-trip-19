import Sorting from './view/sorting.js';
import Filters from './view/filters.js';
import Info from './view/info.js';
import {render, RenderPosition} from './render.js';
import ListPoints from './view/list-points.js';

export default class Presenter{
  #sort;
  #filter;
  #filterMode;
  #info;
  #model;
  #list;
  #eventAddButton;
  #onChangeFilter = (mode)=>{
    this.#filterMode = mode;
    this.#list.filterPoints(this.#filterMode);
  };
  constructor(model) {
    this.#model = model;
    this.#sort = new Sorting();
    this.#filter = new Filters(this.#onChangeFilter);
    this.#info = new Info();
  };
  start = ()=>{
    const sortContainer = document.querySelector('.trip-events');
    render(this.#sort, sortContainer);
    const filterContainer = document.querySelector('.trip-controls__filters');
    render(this.#filter, filterContainer);
    const infoContainer = document.querySelector('.trip-main');
    render(this.#info, infoContainer, RenderPosition.AFTERBEGIN);
    this.#eventAddButton = document.querySelector('.trip-main__event-add-btn');
    this.#eventAddButton.disabled = true;
    this.#model.init(()=>{
      this.#list = new ListPoints(this.#model, this.#actions);
      this.#list.onPost = this.#actions.onPost;
      this.#list.onClose = ()=>this.#actions.onCloseAddForm();
      this.#filter.reset();
      this.#eventAddButton.disabled = false;
      this.#eventAddButton.addEventListener('click', ()=>{
        this.#eventAddButton.disabled = true;
        this.#filter.reset();
        this.#list.newEvent();
      });
      render(this.#list, sortContainer);

    });
  };
  #actions = {
    onCloseAddForm: ()=>{
      this.#eventAddButton.disabled = false;
    },
    onPost: (point)=>{
      this.#model.post(point, (newPoint)=>{
        this.#list.addPoint(newPoint);
      });
    },
    onPut: (point)=>{
      this.#model.put(point, ()=>{
        this.#list.alterPoint(point);
      }, ()=>{

      });
    }
  };
}
