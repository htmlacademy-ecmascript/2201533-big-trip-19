import dayjs from 'dayjs';


class Picture{
  constructor(src, description) {
    this.src = src;
    this.description = description;
  }
}

class Destination{
  constructor(id = null, description = '', name = '', pictures = []) {
    this.id = id;
    this.description = description;
    this.name = name;
    this.pictures = pictures;
  }
}

class Offer{
  constructor(id, title, price) {
    this.id = id;
    this.title = title;
    this.price = price;
  }
}

class Point{
  constructor(
    basePrice = 0,
    dateFrom = dayjs(),
    dateTo = dayjs(),
    destination = -1,
    id = -1,
    isFavorite = false,
    offers = [],
    type = '') {
    this.basePrice = basePrice;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.destination = destination;
    this.id = id;
    this.isFavorite = isFavorite;
    this.offers = offers;
    this.type = type;
  }
}

export default class Model{
  #points = [];
  #destinations = [];
  #typeOfOffers = {};
  #rest;
  #onLoad;
  #loaded = {
    points: false,
    destinations: false,
    offers: false,
    check: ()=>this.#loaded.points && this.#loaded.destinations && this.#loaded.offers
  }
  #load = {
    points: (json)=>{
      json.forEach(point=>{
        this.#points.push(
          new Point(
            point.base_price,
            dayjs(point.date_from),
            dayjs(point.date_to),
            point.destination,
            parseInt(point.id, 10),
            point.is_favorite,
            point.offers,
            point.type
          )
        )
      });
      this.#loaded.points = true;
      if (this.#loaded.check()){
        this.#onLoad();
      }
    },
    destinations: (json)=>{
      json.forEach(destination=>{
        this.#destinations.push(
          new Destination(
            destination.id,
            destination.description,
            destination.name,
            Array.from(destination.pictures, picture=>{return new Picture(picture.src, picture.description)})
          )
        )
      })
      this.#loaded.destinations = true;
      if (this.#loaded.check()){
        this.#onLoad();
      }
    },
    offers: (json)=>{
      json.forEach(type=>{
        this.#typeOfOffers[type.type] =
          Array.from(type.offers, offer=>{return new Offer(offer.id, offer.title, offer.price)})
      });
      this.#loaded.offers = true;
      if (this.#loaded.check()){
        this.#onLoad();
      }
    }
  };
  init = (onLoad)=>{
    this.#onLoad = onLoad;
    this.#rest.GET.points(this.#load.points, console.log);
    this.#rest.GET.destinations(this.#load.destinations, console.log);
    this.#rest.GET.offers(this.#load.offers, console.log);
  };
  points = ()=>{return this.#points};
  destinations = ()=>this.#destinations;
  typeOfOffers = ()=>this.#typeOfOffers;
  types = ()=>Object.keys(this.#typeOfOffers);
  getOffers = (type, offers)=>Array.from(offers,id=>this.#typeOfOffers[type].find(element=>element.id === id));
  getDestination = (id)=>id > -1 ? this.#destinations.find(element=>element.id === id) : new Destination();
  getPoint = (id)=>id > -1 ? this.#points.find(element=>element.id === id) : new Point();
  constructor(rest) {
    this.#rest = rest;
  };
  getRoutesInfo = ()=>{
    return {
      route: ``,
      price: 0,
      start: dayjs(),
      finish: dayjs()
    };
  }
}
