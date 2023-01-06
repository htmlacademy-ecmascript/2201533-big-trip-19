const ICONS = {
  PATH: 'img/icons/',
  EXT: '.png'
};


const ORDER = {
  up: 1,
  down: -1
};

const DEFAULT_ORDERS = {
  day: ORDER.up,
  time: ORDER.down,
  price: ORDER.down
};

const PROMPT_TEXTS = {
    everything: 'Click New Event to create your first point',
    future: 'There are no future events now',
    present: 'There are no present events now',
    past: 'There are no past events now'
  };

const ACTIONS = {
  add: {
    direct: 'post',
    back: 'addPoint'
  },
  alter: {
    direct: 'put',
    back: 'alterPoint'
  },
  delete: {
    direct: 'deletePoint',
    back: 'deleteItem'
  },
};

export {ICONS, ORDER, PROMPT_TEXTS, ACTIONS, DEFAULT_ORDERS}
