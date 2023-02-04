export default class Destination {
  id = -1;
  description = '';
  name = '';
  pictures = [];
  constructor(id, description, name, pictures) {
    this.id = id || id === 0 ? id : this.id;
    this.description = description;
    this.name = name;
    this.pictures = pictures;
  }
}
