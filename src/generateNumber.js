import randomNumber from 'random-number';

const defaultConfig = {
  min: 0,
  max: 100,
  integer: true,
};

export default function generateNumber(config) {
  const cached = this._dictionary.number;
  if (cached !== undefined) return cached;

  const conf = Object.assign({}, defaultConfig, config);
  let number = randomNumber(conf);

  this._dictionary.number = number;
  this._accessed.add('number');
  return number;
}

