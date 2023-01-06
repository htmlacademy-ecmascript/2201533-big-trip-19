import Point from './point';
import Points from './points';
import TripInfo from './trip-info';
import Destinations from './destinations';

class Offer{
  constructor(id, title, price) {
    this.id = id;
    this.title = title;
    this.price = price;
  }
}

export default class Model{
  #info;
  #points;
  #destinations = [];
  #typeOfOffers = {};
  #rest;
  #onLoad;
  #loaded = {
    points: false,
    destinations: false,
    offers: false,
    check: ()=>this.#loaded.points && this.#loaded.destinations && this.#loaded.offers
  };

  #load = {
    points: (json)=>{
      this.#points.fillJson(json);
      this.#info.init(this);
      this.#loaded.points = true;
      if (this.#loaded.check()){
        this.#onLoad();
      }
    },

    destinations: (json)=>{
      this.#destinations.fillJson(json);
      this.#loaded.destinations = true;
      if (this.#loaded.check()){
        this.#onLoad();
      }
    },

    offers: (json)=>{
      json.forEach((type)=>{
        this.#typeOfOffers[type.type] =
          Array.from(type.offers, (offer)=>new Offer(offer.id, offer.title, offer.price));
      });
      this.#loaded.offers = true;
      if (this.#loaded.check()){
        this.#onLoad();
      }
    }
  };

  init = (onLoad)=>{
    this.#onLoad = () => {
      this.#info.recalc(this);
      onLoad();
    };
    this.#rest.GET.points(this.#load.points, console.log);
    this.#rest.GET.destinations(this.#load.destinations, console.log);
    this.#rest.GET.offers(this.#load.offers, console.log);
  };

  post = (point, onAdd)=>{
    this.#rest.POST(point.localPoint, (resp)=>{
      point.id = parseInt(resp.id, 10);
      this.#points.add(point);
      point.recalc(this);
      this.#info.afterAdd(point);
      onAdd({point: point});
    }, console.log);
  };

  put = (point, onAlter, doNothing) => {
    const pointModel = this.getPoint(point.id);
    if (pointModel.equal(point)){
      doNothing('равны')
    }
    else{
      this.#rest.PUT(point, (resp) => {
        const alter = pointModel.alter(point);
        if (alter.includes('basePrice') || alter.includes('offers')){
          point.recalc(this);
        }
        this.#info.afterAlter(point, alter, point.pricePoint - pointModel.pricePoint);
        onAlter({point: point, alter: alter});
      }, doNothing)
    }
  };

  changeFavourite = (point, onChange, doNothing) => {
    const changedPoint = point.copy();
    changedPoint.isFavorite = !point.isFavorite;
    this.#rest.PUT(changedPoint, (resp) => {
      point.isFavorite = !point.isFavorite;
      onChange(point);
    }, doNothing);
  };

  deletePoint = (point, onDelete, doNothing)=>{
    const id = point.id;
    this.#rest.DELETE(id, () => {
      this.#points.delete(id);
      this.#info.afterDelete(point);
      onDelete({id: id});
    }, doNothing);
  };

  #filters = {
    everything: () => true,
    future: (point) => point.dateFrom > this.#filters.currentDate,
    present: (point) => point.dateFrom <= this.#filters.currentDate && point.dateTo >= this.#filters.currentDate,
    past: (point) => point.dateTo < this.#filters.currentDate
  };

  pointsFilter = (mode, currentDate) => {
    this.#filters.currentDate = currentDate;
    const filterPoints = new Points();
    filterPoints.list = this.#points.list.filter(point => this.#filters[mode](point));
    return filterPoints;
  };

  get destinations (){return this.#destinations};

  types = ()=>Object.keys(this.#typeOfOffers);

  getOffers = (type, offers) => Array.from(offers,id=>this.#typeOfOffers[type].find(element=>element.id === id));

  //getDestination = (id) => id > -1 ? this.#destinations.find(element=>element.id === id) : new Destination();

  getPoint = (id) => id > -1 ? this.#points.find(id) : new Point();

  get typeOfOffers(){return this.#typeOfOffers};

  get points(){return this.#points};

  get info(){return this.#info};

  constructor(rest) {
    this.#rest = rest;
    this.#points = new Points();
    this.#destinations = new Destinations();
    this.#info = new TripInfo();
  };
}