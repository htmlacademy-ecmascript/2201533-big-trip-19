import ListPoints from './view/list-points';

console.log('main.js');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);
import Rest from './rest.js';
import Model from './model.js';
import Sorting from './view/sorting.js';
import Filters from './view/filters.js';
import Info from './view/info.js';
import {render, RenderPosition} from './render.js';
const rest = new Rest();
const model = new Model(rest);

model.init(()=>{
  if (model.points().length > 0){
    const list = new ListPoints(model);
    render(list, sortContainer);
    eventAddButton.addEventListener('click', ()=>{list.newEvent()});
  }
});

const sort = new Sorting()
const filter = new Filters();
const info = new Info();

const sortContainer = document.querySelector('.trip-events');
render(sort, sortContainer);
const filterContainer = document.querySelector('.trip-controls__filters');
render(filter, filterContainer);
const infoContainer = document.querySelector('.trip-main');
render(info, infoContainer, RenderPosition.AFTERBEGIN);
const eventAddButton = document.querySelector('.trip-main__event-add-btn');



//rest.GET.destinations(console.log, console.log);

