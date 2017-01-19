# attempt

Attempt is a small library for easily running a massive amount of tests with
different arguments.

Usually, a developer will write a few, or maybe a few dozen tests verifying some
method's behavior with different input. Attempt aims to make it trivial to test
huge amounts of input arguments in a legible way. This should make your test
suite shorter and easier to reason about, which in turn making tests easier to
write and maintain.

The idea of attempt is that you define the behavior of your program rather
than passing actual values. Once you have done this attempt will try to find any
edge cases by passing random values to your function. Once a test returns false
or throws, it makes the test fail with a descriptive error message.

Below is an example of a failing test:

```
 FAIL  __tests__/foo.js
  ● foo › should do something

    Test returned false
    Test failed after 363 iterations when given input
    3
    53
```

# Installation

To install the current stable version:

    npm install --save-dev attempt-test

Then simply `import` or `require` it in your tests:

    import attempt from 'attempt-test';

# Examples

You can use attempt with any testing framework, but the following examples will
use [jest][1] and [jasmine][2] as the examples. For legibility, the examples
will also use async functions, but with jest you can just as easily write
`return attempt` or handle the promise rejection manualy by implementing
`.catch(...)`.

This is the most basic example. We have a function that adds two numbers, and we
want to know if it always returns the correct result.

```javascript
import attempt from 'attempt-test';
import add from './add-two-numbers';

it('should add two numbers', async () => (
  attempt((a, b) => (
    add(a.number(), b.number()) === a.number() + b.number()
  ))
));
```

You can also configure attempt in different ways. See the API section below for
details.

```javascript
import attempt from 'attempt-test';
import slowTask from './slow-task';

it('should run a slow task', async () => (
  attempt((a, b) => {
    // Create a string of random characters of random length
    const string = a.string('*', b.number());

    return slowTask(string) !== null
  }, { timeout: 1000 })
));
```

# API

```javascript
attempt(function, config);
```

The main function running the tests. By default it will run 1000 iterations of
random values on the function, stopping only for the following reasons:

 - The test function returns `false`
 - An error is thrown
 - The test successfully passes all iterations

### function

The main function. This will be invoked one thousand times by default, running
any code you put in it that amount of times.

See the argument section below for an explanation

### config

The configuration object accepts the following values:

|Name      |Value                                                   |
|----------|--------------------------------------------------------|
|iterations|Number - The amount of iterations to run (default 1000) |
|timeout   |Number - Milliseconds before the test is aborted        |


## argument

The test function is passed a set arguments. Each of these arguments are objects
which contain value generators for use in your test.

```javascript
attempt((a) => {
  console.log(a);
  // {
  //   num(),
  //   number(),
  //   str(),
  //   string(),
  // }
});
```

### argument.num(config) | argument.number(config)

Generates a javascript number. By default number generates an integer between 0
and 100, but this is easily configurable by passing a configuration object.

The configuration object recognizes the following values:

|Name   |Value                                                              |
|-------|-------------------------------------------------------------------|
|min    |Number - The lowest possible number to generate (default 0)        |
|max    |Number - The highest possible number to generate (default 100)     |
|integer|boolean - Generates a decimal number if set to false (default true)|

```javascript
const number = a.number({ min: -20, max: 20, integer: false });
```

### argument.str(pattern, length, options) | argument.string(pattern, length, options)

Generates a javascript string. By default it generates a string of all
characters with a length of 10, but this is easily configurable by passing
arguments to the constructor.

See the [randomatic documentation][3] for a detailed description of the input
parameters you can pass to string.

The arguments are as follows:

|Name   |Value                                                                 |
|-------|----------------------------------------------------------------------|
|pattern|String - The format of output (default '\*')                          |
|length |Number - The length of the string to generate (default 10)            |
|options|object - A configuration object. See the [randomatic documentation][3]|

```javascript
const lowercaseString = a.string('a', 31);
const uppercaseString = b.string('A');
const customChars = c.string('?', 20, { chars: 'æøåÆØÅ' });
```


[1]: https://facebook.github.io/jest/
[2]: https://jasmine.github.io/
[3]: https://github.com/jonschlinkert/randomatic/#api

