

class Picture{
  constructor(src, description) {
    this.src = src;
    this.description = description;
  }
}

class Destination{
  constructor(id, description, name, pictures) {
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
  constructor(basePrice, dateFrom, dateTo, destination, id, isFavorite, offers, type) {
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
  #load = {
    points: (json)=>{
      json.forEach(point=>{
        this.#points.push(
          new Point(
            point.base_price,
            new Date(point.date_from),
            new Date(point.date_to),
            point.destinations,
            parseInt(point.id, 10),
            point.is_favorite,
            point.offers,
            point.type
          )
        )
      })
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
    },
    offers: (json)=>{
      json.forEach(type=>{
        this.#typeOfOffers[type.type] =
          Array.from(type.offers, offer=>{return new Offer(offer.id, offer.title, offer.price)})
      })
    }
  }
  init = ()=>{
    this.#rest.GET.points(this.#load.points, console.log);
    this.#rest.GET.destinations(this.#load.destinations, console.log);
    this.#rest.GET.offers(this.#load.offers, console.log);
  }
  constructor(rest) {
    this.#rest = rest;
  }
}
