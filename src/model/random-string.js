import {LengthRandomString} from '../settings';

const getRandomInt = (start, end) => {
  const max = Math.floor(Math.max(start, end));
  const min = Math.ceil(Math.min(start, end));
  if (min < 0) {
    return NaN;
  }
  return Math.floor((max - min + 1) * Math.random() + min);
};

const getRandomString = () => {
  const codes = Array.from(
    new Array(getRandomInt(LengthRandomString.MIN, LengthRandomString.MAX)), () => {
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

export {getRandomString};
