const Icons = {
  PATH: 'img/icons/',
  EXT: '.png',
  DEFAULT: 'img/logo.png'
};


const Order = {
  UP: 1,
  DOWN: -1,
  NOT: 0
};

const SortAttrs = {
  DAY: {name: 'day', title: 'Day', disabled: false, checked: true, order: Order.UP},
  EVENT: {name: 'event', title: 'Event', disabled: true, order: Order.NOT},
  TIME: {name: 'time', title: 'Time', disabled: false, order: Order.DOWN},
  PRICE: {name: 'price', title: 'Price', disabled: false, order: Order.DOWN},
  OFFER: {name: 'offer', title: 'Offer', disabled: true, order: Order.NOT}
};

const DIFF_CLICK = 1000;

const FilterAttrs = {
  EVERYTHING: {name: 'everything', title: 'Everything', checked: true},
  FUTURE: {name: 'future', title: 'Future', checked: false},
  PRESENT: {name: 'present', title: 'Present', checked: false},
  PAST: {name: 'past', title: 'Past', checked: false}
};

const PromptTexts = {
  everything: 'Click New Event to create your first point',
  future: 'There are no future events now',
  present: 'There are no present events now',
  past: 'There are no past events now'
};

const SubmitMode = {
  ADD: {
    direct: 'post',
    back: 'addPoint'
  },
  ALTER: {
    direct: 'put',
    back: 'alterPoint'
  },
  DELETE: {
    direct: 'deletePoint',
    back: 'deleteItem'
  },
};

export {Icons, Order, PromptTexts, SubmitMode, FilterAttrs, SortAttrs, DIFF_CLICK};
//https://codernet.ru/articles/js/kak_osushhestvit_dvizhenie_obektov_v_javascript_instrukcziya_s_primerami/
