import generateArg from './generateArg';

const defaultConfig = {
  iterations: 1000,
};

function argumentsToString(args) {
  return args.reduce((prev, arg) => {
    if (!arg._accessed.size) return prev;

    return prev + [...arg._accessed].reduce((prev, type) => (
      `${prev ? `${prev}, ` : prev}${arg._dictionary[type]}`
    ), '') + '\n'
  }, '');
}

export default async function attempt(func, config) {
  const conf = Object.assign({}, defaultConfig, config);
  let args = Array(func.length).fill(null);

  try {
    let startTime = + new Date();

    let i = 0;
    let timeoutPassed = false;
    while (!timeoutPassed && i++ < conf.iterations) {
      args = args.map(generateArg);
      args._iterations = i;

      if (func(...args) === false) {
        throw new Error('Test returned false');
      }

      if (conf.timeout) {
        const currentTime = + new Date();
        timeoutPassed = (currentTime - startTime) > conf.timeout;
      }
    }
  } catch (e) {
    const stringifiedArguments = argumentsToString(args);
    e.message += `\nTest failed after ${args._iterations} iterations`;

    if (stringifiedArguments.length) {
      e.message += ` when given input\n${stringifiedArguments}`;
    }

    throw e;
  }
}

