console.log('main.js');
import Rest from './rest.js';
import Model from './model.js';
import Sorting from './view/sorting.js';
import Filters from './view/filters.js';
import {render} from './render.js';
const rest = new Rest();
const model = new Model(rest);

model.init();

const sort = new Sorting()
const filter = new Filters();

console.log(filter);

const sortContainer = document.querySelector('.trip-events');
render(sort, sortContainer);
const filterContainer = document.querySelector('.trip-controls__filters');
render(filter, filterContainer);

console.log(sort.getElement());


//rest.GET.destinations(console.log, console.log);

