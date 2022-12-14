console.log('main.js');
import Rest from './rest.js';
import Model from './model.js';
const rest = new Rest();
const model = new Model(rest);

model.init();

//rest.GET.destinations(console.log, console.log);

