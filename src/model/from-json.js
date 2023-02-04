import Point from './point';
import dayjs from 'dayjs';
import Destination from './destination';

class Picture {
  constructor(src, description) {
    this.src = src;
    this.description = description;
  }
}

const newPointFromJson = (json) => new Point(
  json.base_price,
  dayjs(json.date_from),
  dayjs(json.date_to),
  json.destination,
  parseInt(json.id, 10),
  json.is_favorite,
  json.offers,
  json.type
);

const newDestinationFromJson = (json) => new Destination(
  json.id,
  json.description,
  json.name,
  Array.from(json.pictures, (picture) => new Picture(picture.src, picture.description))
);

export {newPointFromJson, newDestinationFromJson};
