import randomString from 'randomatic';

const defaultPattern = '*';
const defaultLength = 10;

export default function generateString(
  pattern = defaultPattern,
  length = defaultLength,
  options = {}
) {
  const cached = this._dictionary.string;
  if (cached !== undefined) return cached;

  let string = randomString(pattern, length, options);

  this._dictionary.string = string;
  this._accessed.add('string');
  return string;
}

