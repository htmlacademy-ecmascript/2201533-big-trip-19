const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
const flatpickr = require('flatpickr');
require("flatpickr/dist/themes/dark.css");
import Rest from './model/rest.js';
import Model from './model/model.js';
import Presenter from './presenter/presenter.js';
const rest = new Rest();
const model = new Model(rest);
const presenter = new Presenter(model);
presenter.start();
