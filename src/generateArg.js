import generateNumber from './generateNumber';
import generateString from './generateString';

export default function generateArg() {
  return {
    _accessed: new Set(),
    _dictionary: {},
    number: generateNumber,
    num: generateNumber,
    string: generateString,
    str: generateString,
  };
}

