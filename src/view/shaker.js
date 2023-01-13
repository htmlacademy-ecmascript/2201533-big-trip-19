const Sign = {
  UPPER: -1,
  TOP: 1
};
const Directions = {
  UP: 1,
  DOWN: -1
};
const INTERVAL = 41;

export default class Shaker {
  #amplitude;
  #windingsCount;
  #duration;
  #step;
  #timerId;
  #onStep;
  #onStop;

  constructor(options) {
    this.#amplitude = options.amplitude;
    this.#windingsCount = options.count;
    this.#duration = options.duration;
    this.#step = options.amplitude / options.duration * INTERVAL;
  }

  set onStep(onStep) {
    this.#onStep = onStep;
  }

  set onStop(onStop) {
    this.#onStop = onStop;
  }

  start() {
    let count = 0;
    let ordinate = 0;
    let sign = Sign.UPPER;
    let direction = Directions.UP;
    const onNull = () => {
      sign *= -1;
      direction *= -1;
      count++;
      if (count === this.#windingsCount) {
        clearInterval(this.#timerId);
        this.#onStop();
      }
    };
    const onMax = () => {
      direction *= -1;
    };
    const onPoint = [onNull, onMax];
    this.#timerId = setInterval(() => {
      const index = (1 + direction) / 2;
      ordinate += this.#step * direction;
      if (ordinate * direction > index * this.#amplitude) {
        ordinate = index * this.#amplitude;
        onPoint[index]();
      }
      this.#onStep(Math.round(ordinate) * sign);
    }, INTERVAL);
  }
}
