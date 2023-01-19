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

const FormFields = {
  DATE_FROM: 'dateFrom',
  DATE_TO: 'dateTo',
  OFFERS: 'offers',
  DURATION: 'duration',
  DESTINATION: 'destination',
  TYPE: 'type',
  TITLE: 'title',
  PRICE: 'basePrice'
};

const SortAttrs = {
  DAY: {name: 'day', title: 'Day', disabled: false, checked: true, order: Order.UP, field: FormFields.DATE_FROM},
  EVENT: {name: 'event', title: 'Event', disabled: true, order: Order.NOT},
  TIME: {name: 'time', title: 'Time', disabled: false, order: Order.DOWN, field: FormFields.DURATION},
  PRICE: {name: 'price', title: 'Price', disabled: false, order: Order.DOWN, field: FormFields.PRICE},
  OFFER: {name: 'offer', title: 'Offer', disabled: true, order: Order.NOT}
};

const DIFF_CLICK = 1000;

const FilterAttrs = {
  EVERYTHING: {name: 'everything', title: 'Everything', checked: true},
  FUTURE: {name: 'future', title: 'Future', checked: false},
  PRESENT: {name: 'present', title: 'Present', checked: false},
  PAST: {name: 'past', title: 'Past', checked: false}
};

const ENDPOINT = 'name_of_table';

const PromptTexts = {
  everything: 'Click New Event to create your first point',
  future: 'There are no future events now',
  present: 'There are no present events now',
  past: 'There are no past events now',
  loading: 'Loading...',
  error: `Failed to load the "${ENDPOINT}" table
  Reason: `,
};

const SubmitMode = {
  ADD: {
    direct: 'post',
    back: 'addPoint',
    directText: 'Saving',
    backText: 'Save'
  },
  ALTER: {
    direct: 'put',
    back: 'alterPoint',
    directText: 'Saving',
    backText: 'Save'
  },
  DELETE: {
    direct: 'deletePoint',
    back: 'deleteItem',
    directText: 'Deleting',
    backText: 'Delete'
  },
};

const SHAKING_PARAM = {
  amplitude: 40,
  count: 3,
  duration: 500
};

const ViewMode = {
  list: 'UL',
  prompt: 'P'
};

const FILL_POINTS = true;

export {
  Icons, Order, PromptTexts, SubmitMode, FilterAttrs, SortAttrs,
  DIFF_CLICK, SHAKING_PARAM, FormFields, ViewMode, ENDPOINT, FILL_POINTS
};

