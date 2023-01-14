const getRandomInt = (start, end) => {
  const max = Math.floor(Math.max(start, end));
  const min = Math.ceil(Math.min(start, end));
  if (min < 0) {
    return NaN;
  }
  return Math.floor((max - min + 1) * Math.random() + min);
};


export default class RandomString {
  #MIN_LENGTH = 5;
  #MAX_LENGTH = 15;
  #value;
  #generate = () => {
    const codes = Array.from(
      new Array(getRandomInt(this.#MIN_LENGTH, this.#MAX_LENGTH)), () => {
        const index = getRandomInt(0, 61);
        if (index > 35) {
          return index + 61;
        }
        if (index > 9) {
          return index + 55;
        }
        return index + 48;
      }
    );
    return String.fromCharCode.apply(null, codes);
  };

  get = () => this.#value;

  constructor() {
    this.#value = this.#generate();
  }
}
